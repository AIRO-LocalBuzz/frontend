import React, { useState, useEffect } from 'react';
import Statusbar from '../../components/Statusbar/Statusbar';
import HomeNav from '../../components/HomeNav/HomeNav';
import Banner from '../../components/Banner/Banner';
import RegionSelect from '../../components/RegionSelect/RegionSelect';
import CategorySelect from '../../components/CategorySelect/CategorySelect';
import Review from '../../components/Review/Review';
import Lists from '../../components/Lists/Lists';
import Modal from '../../components/Modal/Modal';
import { apiUrl } from '../../lib/apiUrl';
import './HomePage.css';

const HomePage = ({ isKakaoMapLoaded }) => {
    const [activeRegion, setActiveRegion] = useState('서울');
    const [isModalOpen, setModalOpen] = useState(false);
    const [megaCode, setMegaCode] = useState(null);
    const [cityCode, setCityCode] = useState(null);
    const [listItems, setListItems] = useState([]);
    const [activeCategory, setActiveCategory] = useState('음식점');

    useEffect(() => {
        // 기본 지역: 서울특별시 종로구
        const defaultRegion = '서울';
        const defaultMegaCode = 11;
        const defaultCityCode = 11110;

        setActiveRegion(defaultRegion);
        setMegaCode(defaultMegaCode);
        setCityCode(defaultCityCode);
        handleFetchList(defaultMegaCode, defaultCityCode, '음식점');
    }, []);

    const handleRegionClick = (regionName) => {
        setActiveRegion(regionName);
        setModalOpen(true);
    };

    const handleSelectRegion = (megaCode, cityCode) => {
        setMegaCode(megaCode);
        setCityCode(cityCode);
        handleFetchList(megaCode, cityCode, activeCategory);
    };

    const foodImages = Object.values(import.meta.glob('../../assets/images/sample/eating/*.jpg', { eager: true, import: 'default' }));
    const cafeImages = Object.values(import.meta.glob('../../assets/images/sample/drinking/*.jpg', { eager: true, import: 'default' }));
    const stayImages = Object.values(import.meta.glob('../../assets/images/sample/lodging/*.jpg', { eager: true, import: 'default' }));
    const expImages = Object.values(import.meta.glob('../../assets/images/sample/doing/*.jpg', { eager: true, import: 'default' }));
    const etcImages = Object.values(import.meta.glob('../../assets/images/sample/etc/*.jpg', { eager: true, import: 'default' }));

    const pickUniqueRandomIndices = (wantCount, total) => {
        const count = Math.min(wantCount, total);
        const set = new Set();
        while (set.size < count) set.add(Math.floor(Math.random() * total));
        return [...set];
    };

    const mapData = (rawItems, imgArray, tagCheck, titleKey, descKey, townKey) => {
        const picks = pickUniqueRandomIndices(5, imgArray.length);
        return rawItems.slice(0, 5).map((item, idx) => ({
            desc: item[descKey],
            title: item[titleKey],
            town: item[townKey] || '',
            tag: [
                ...(item[titleKey]?.includes(tagCheck) ? ['인기'] : []),
                'NEW'
            ],
            isPlaceholder: false,
            image: imgArray[picks[idx]] ?? imgArray[0],
        }));
    };

    const mapFoodData = (rawItems) => mapData(rawItems, foodImages, '식당', 'name', 'indeScleName', 'roadAddr');
    const mapCafeData = (rawItems) => mapData(rawItems, cafeImages, '찻집', 'name', 'indeScleName', 'roadAddr');
    const mapStayData = (rawItems) => mapData(rawItems, stayImages, '호텔', 'name', 'indeScleName', 'roadAddr');
    const mapExperienceData = (rawItems) => mapData(rawItems, expImages, '전통문화', 'vilageName', 'experienceType', 'region');
    const mapEtcData = (rawItems) => mapData(rawItems, etcImages, '축제', 'name', 'endDate', 'place');

    const handleFetchList = async (megaCode, cityCode, category = '음식점') => {
        let url = '';
        let converter = null;

        if (category === '음식점') {
            url = `/v1/shop?megaCode=${megaCode}&cityCode=${cityCode}&largeCategoryCode=I2&page=0&size=5`;
            converter = mapFoodData;
        } else if (category === '카페') {
            url = `/v1/shop?megaCode=${megaCode}&cityCode=${cityCode}&largeCategoryCode=I2&smallCategoryCode=I21201&page=0&size=5`;
            converter = mapCafeData;
        } else if (category === '숙소') {
            url = `/v1/shop?megaCode=${megaCode}&cityCode=${cityCode}&largeCategoryCode=I1&page=0&size=5`;
            converter = mapStayData;
        } else if (category === '체험') {
            url = `/v1/rural/ex?megaCode=${megaCode}&cityCode=${cityCode}&page=0&size=5`;
            converter = mapExperienceData;
        } else if (category === '기타') {
            url = `/v1/clutr/fatvl?megaCode=${megaCode}&cityCode=${cityCode}&page=0&size=5`;
            converter = mapEtcData;
        }

        try {
            const res = await fetch(apiUrl(url), {
                headers: { accept: '*/*' }
            });

            if (!res.ok) throw new Error('API 호출 실패');

            const data = await res.json();
            const rawItems = data.result?.content || [];
            let converted = converter(rawItems);

            if (converted.length < 5) {
                const fillerCount = 5 - converted.length;
                const placeholders = Array.from({ length: fillerCount }, () => ({
                    desc: '',
                    title: '콘텐츠 준비 중입니다.',
                    town: '',
                    tag: [],
                    isPlaceholder: true,
                }));
                converted = [...converted, ...placeholders];
            }

            setListItems(converted);
        } catch (err) {
            console.error('API 호출 실패:', err);
            setListItems([{
                desc: '',
                title: '콘텐츠 준비 중입니다.',
                town: '',
                tag: [],
                isPlaceholder: true,
            }]);
        }
    };


    return (
        <>
            <section className='main'>
                <Statusbar />
                <HomeNav />
                <Banner isKakaoMapLoaded={isKakaoMapLoaded} />
                <div className='region_container'>
                    <RegionSelect
                        activeRegion={activeRegion}
                        onRegionClick={handleRegionClick}
                    />
                </div>
                <div className='category_container'>
                    <CategorySelect
                        activeCategory={activeCategory}
                        onCategoryClick={(category) => {
                            setActiveCategory(category);
                            handleFetchList(megaCode, cityCode, category);
                        }}
                    />
                    <div className='content'>
                        <Review />
                        <Lists listItems={listItems} category={activeCategory} />
                    </div>
                </div>
                {isModalOpen && (
                    <Modal
                        region={activeRegion}
                        onSelectRegion={handleSelectRegion}
                        onClose={() => setModalOpen(false)}
                    />
                )}
            </section>
        </>
    );
};

export default HomePage;
