import React, { useState, useEffect } from 'react';
import Statusbar from '../../components/Statusbar/Statusbar';
import HomeNav from '../../components/HomeNav/HomeNav';
import Banner from '../../components/Banner/Banner';
import RegionSelect from '../../components/RegionSelect/RegionSelect';
import CategorySelect from '../../components/CategorySelect/CategorySelect';
import Review from '../../components/Review/Review';
import Lists from '../../components/Lists/Lists';
import Modal from '../../components/Modal/Modal';
import './HomePage.css';

const HomePage = () => {
    const [activeRegion, setActiveRegion] = useState('서울');
    const [isModalOpen, setModalOpen] = useState(false);
    const [megaCode, setMegaCode] = useState(null);
    const [cityCode, setCityCode] = useState(null);
    const [listItems, setListItems] = useState([]);
    const [activeCategory, setActiveCategory] = useState('음식점');
    const getUniqueRandomImageNumbers = (max, count) => {
        const set = new Set();
        while (set.size < count) {
            set.add(Math.floor(Math.random() * max) + 1);
        }
        return [...set];
    };

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

    const mapFoodData = (rawItems) => {
        const imageNumbers = getUniqueRandomImageNumbers(10, 5);
        return rawItems.slice(0, 5).map((item, idx) => ({
            desc: item.indeScleName,
            title: item.name,
            town: item.roadAddr || item.lotAddr || '',
            tag: [
                ...(item.name.includes('식당') ? ['인기'] : []),
                'NEW'
            ],
            isPlaceholder: false,
            image: `/src/assets/images/eating/img-food${imageNumbers[idx]}.jpg`,
        }));
    };

    const mapCafeData = (rawItems) => {
        const imageNumbers = getUniqueRandomImageNumbers(10, 5);
        return rawItems.slice(0, 5).map((item, idx) => ({
            desc: item.indeScleName,
            title: item.name,
            town: item.roadAddr || item.lotAddr || '',
            tag: [
                ...(item.name.includes('찻집') ? ['인기'] : []),
                'NEW'
            ],
            isPlaceholder: false,
            image: `/src/assets/images/drinking/img-cafe${imageNumbers[idx]}.jpg`,
        }));
    };

    const mapStayData = (rawItems) => {
        const imageNumbers = getUniqueRandomImageNumbers(10, 5);
        return rawItems.slice(0, 5).map((item, idx) => ({
            desc: item.indeScleName,
            title: item.name,
            town: item.roadAddr || item.lotAddr || '',
            tag: [
                ...(item.name.includes('호텔') ? ['인기'] : []),
                'NEW'
            ],
            isPlaceholder: false,
            image: `/src/assets/images/lodging/img-stay${imageNumbers[idx]}.jpg`,
        }));
    };

    const mapExperienceData = (rawItems) => {
        const imageNumbers = getUniqueRandomImageNumbers(10, 5);
        return rawItems.slice(0, 5).map((item, idx) => ({
            desc: item.experienceType,
            title: item.vilageName,
            town: item.region,
            tag: [
                ...(item.experienceType.includes('전통문화') ? ['인기'] : []),
                'NEW'
            ],
            isPlaceholder: false,
            image: `/src/assets/images/doing/img-ex${imageNumbers[idx]}.jpg`,
        }));
    };

    const mapEtcData = (rawItems) => {
        const imageNumbers = getUniqueRandomImageNumbers(10, 5);
        return rawItems.slice(0, 5).map((item, idx) => ({
            desc: item.endDate,
            title: item.name,
            town: item.place,
            tag: [
                ...(item.name.includes('축제') ? ['인기'] : []),
                'NEW'
            ],
            isPlaceholder: false,
            image: `/src/assets/images/etc/img-cul${imageNumbers[idx]}.jpg`,
        }));
    };

    const handleFetchList = async (megaCode, cityCode, category = '음식점') => {
        let url = '';
        let converter = null;

        if (category === '음식점') {
            url = `/api/v1/shop?megaCode=${megaCode}&cityCode=${cityCode}&largeCategoryCode=I2&page=0&size=5`;
            converter = mapFoodData;
        } else if (category === '카페') {
            url = `/api/v1/shop?megaCode=${megaCode}&cityCode=${cityCode}&largeCategoryCode=I2&smallCategoryCode=I21201&page=0&size=5`;
            converter = mapCafeData;
        } else if (category === '숙소') {
            url = `/api/v1/shop?megaCode=${megaCode}&cityCode=${cityCode}&largeCategoryCode=I1&page=0&size=5`;
            converter = mapStayData;
        } else if (category === '체험') {
            url = `/api/v1/rural/ex?megaCode=${megaCode}&cityCode=${cityCode}&page=0&size=5`;
            converter = mapExperienceData;
        } else if (category === '기타') {
            url = `/api/v1/clutr/fatvl?megaCode=${megaCode}&cityCode=${cityCode}&page=0&size=5`;
            converter = mapEtcData;
        }

        try {
            const res = await fetch(url, {
                headers: { 'accept': '*/*' }
            });

            if (!res.ok) throw new Error('API 호출 실패');

            const data = await res.json();
            // console.log('[DEBUG] 응답 데이터:', data);
            const rawItems = data.result?.content || [];
            // console.log('[DEBUG] 추출된 content:', rawItems[0]);
            // console.log(res);


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
                <Banner />
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
