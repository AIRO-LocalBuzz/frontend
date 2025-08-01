import React, { useState, useEffect } from 'react';
import Statusbar from '../../components/statusBar';
import Nav from '../../components/Nav';
import Banner from '../../components/Banner';
import RegionSelect from '../../components/RegionSelect';
import CategorySelect from '../../components/CategorySelect';
import Review from '../../components/Review';
import Lists from '../../components/Lists';
import Modal from '../../components/Modal';
import './MainPage.css';

const MainPage = () => {
    const [activeRegion, setActiveRegion] = useState('서울');
    const [isModalOpen, setModalOpen] = useState(false);
    const [megaCode, setMegaCode] = useState(null);
    const [cityCode, setCityCode] = useState(null);
    const [listItems, setListItems] = useState([]);
    const [activeCategory, setActiveCategory] = useState('체험');
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
        handleFetchList(defaultMegaCode, defaultCityCode, '체험');
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

    const mapShopData = (rawItems, filterType) => {
        const imageNumbers = getUniqueRandomImageNumbers(10, 5);
        const filteredItems = rawItems.filter(item => item.indeScleName === filterType);

        return filteredItems.slice(0, 5).map((item, idx) => ({
            desc: item.indeScleName,
            title: item.name,
            town: item.lotAddr,
            tag: ['NEW'],
            isPlaceholder: false,
            image: `/src/assets/images/eating/img-shop${imageNumbers[idx]}.jpg`,
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

    const handleFetchList = async (megaCode, cityCode, category = '체험') => {
        let url = '';
        let converter = null;
        let filterType = '';

        if (category === '체험') {
            url = `/api/api/v1/rural/ex?megaCode=${megaCode}&cityCode=${cityCode}&page=0&size=5`;
            converter = mapExperienceData;
        } else if (category === '기타') {
            url = `/api/api/v1/clutr/fatvl?megaCode=${megaCode}&cityCode=${cityCode}&page=0&size=5`;
            converter = mapEtcData;
        } else {
            url = `/api/api/v1/shop?megaCode=${megaCode}&cityCode=${cityCode}&page=0&size=5`;
            filterType = category; // '음식', '카페', '숙박'
            converter = (rawItems) => mapShopData(rawItems, filterType);
        }

        try {
            const res = await fetch(url, {
                headers: { 'accept': '*/*' }
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
                <Nav />
                <Banner />
                <div className='container'>
                    <RegionSelect
                        activeRegion={activeRegion}
                        onRegionClick={handleRegionClick}
                    />
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

export default MainPage;
