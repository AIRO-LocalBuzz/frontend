import React, { useEffect, useState } from 'react';
import './Modal.css';

// const API_HOST = import.meta.env.VITE_API_HOST; // CORS 허용 요청

export default function Modal({ region, onClose, onSelectRegion }) {
    const [megaList, setMegaList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(region || '서울');
    const [selectedCityFullName, setSelectedCityFullName] = useState('');
    const [selectedCityPerGroup, setSelectedCityPerGroup] = useState({});
    const [selectedMegaId, setSelectedMegaId] = useState(null);
    const [selectedCityCode, setSelectedCityCode] = useState(null);

    // 시/도 그룹 정의
    const groupedMegaMap = {
        서울: ['서울특별시'],
        경기도: ['경기도'],
        강원도: ['강원특별자치도'],
        충청도: ['충청북도', '충청남도', '세종특별자치시'],
        전라도: ['전라남도', '전북특별자치도', '광주광역시'],
        경상도: ['경상북도', '경상남도', '대구광역시', '부산광역시', '울산광역시'],
        제주도: ['제주특별자치도'],
    };

    // 데이터 호출
    useEffect(() => {
        const headers = {
            'accept': '*/*',
            'X-SWAGGER-REQUEST': 'true',
        };

        Promise.all([
            fetch('/api/api/v1/area/mega/code', { headers }),
            fetch('/api/api/v1/area/city/code', { headers }),
        ])
            .then(async ([res1, res2]) => {
                if (!res1.ok || !res2.ok) throw new Error('응답 오류 발생');
                const megaData = await res1.json();
                const cityData = await res2.json();
                setMegaList(megaData.result);
                setCityList(cityData.result);
            })
            .catch(err => console.error('API 요청 실패:', err));
    }, []);
    // 배포시 사용
    // useEffect(() => {
    //     const headers = {
    //         'accept': '*/*',
    //         'X-SWAGGER-REQUEST': 'true',
    //     };

    //     Promise.all([
    //         fetch(`${API_HOST}/api/v1/area/mega/code`, { headers }),
    //         fetch(`${API_HOST}/api/v1/area/city/code`, { headers }),
    //     ])
    //         .then(async ([res1, res2]) => {
    //             if (!res1.ok || !res2.ok) throw new Error('응답 오류 발생');
    //             const megaData = await res1.json();
    //             const cityData = await res2.json();
    //             setMegaList(megaData.result);
    //             setCityList(cityData.result);
    //         })
    //         .catch(err => console.error('API 요청 실패:', err));
    // }, []);



    // 현재 그룹에 해당하는 megaCode 목록
    const selectedMegaNames = groupedMegaMap[selectedGroup] || [];
    const selectedMegaCodes = megaList
        .filter(m => selectedMegaNames.includes(m.megaName))
        .map(m => ({ id: m.id, name: m.megaName }));

    // 필터링된 도시 목록 (서울특별시 종로구, 경기도 수원시 장안구 등)
    const filteredCityFullNames = cityList
        .filter(city => selectedMegaCodes.some(m => m.id === city.megaCodeId))
        .map(city => {
            const mega = selectedMegaCodes.find(m => m.id === city.megaCodeId);
            return `${mega?.name} ${city.cityName}`;
        });

    // selectedGroup 변경 시 첫 번째 도시 자동 선택
    useEffect(() => {
        if (filteredCityFullNames.length === 0) return;

        const saved = selectedCityPerGroup[selectedGroup];
        const defaultCity = saved || filteredCityFullNames[0];

        setSelectedCityFullName(defaultCity);

        if (!saved) {
            setSelectedCityPerGroup(prev => ({
                ...prev,
                [selectedGroup]: defaultCity
            }));
        }
    }, [selectedGroup, cityList]);

    const handleRegionSelect = (group) => {
        setSelectedGroup(group);
    };

    const handleCityClick = (cityFullName) => {
        setSelectedCityFullName(cityFullName);
        setSelectedCityPerGroup(prev => ({
            ...prev,
            [selectedGroup]: cityFullName
        }));

        const selectedMega = selectedMegaCodes.find(m => cityFullName.startsWith(m.name));
        const selectedCity = cityList.find(c =>
            `${selectedMega?.name} ${c.cityName}` === cityFullName
        );

        if (selectedMega && selectedCity) {
            setSelectedMegaId(selectedMega.id);
            setSelectedCityCode(selectedCity.id);
        }
    };

    const handleClose = () => {
        if (selectedMegaId !== null && selectedCityCode !== null) {
            console.log('X버튼 전달:', selectedMegaId, selectedCityCode);
            onSelectRegion(selectedMegaId, selectedCityCode);
        } else {
            console.warn('지역 또는 도시가 선택되지 않았습니다.');
        }
        onClose();
    };


    return (
        <div className="modal_back">
            <div className="modal">
                <div className="modal_title">
                    <p>지역 선택</p>
                    <button className="close" onClick={handleClose}>

                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0)">
                                <path d="M15.6653 1.95098C16.1116 1.50467 16.1116 0.781049 15.6653 0.334735C15.219 -0.111578 14.4953 -0.111578 14.049 0.334735L8 6.38376L1.95098 0.334735C1.50467 -0.111578 0.781049 -0.111578 0.334735 0.334735C-0.111578 0.781049 -0.111578 1.50467 0.334735 1.95098L6.38376 8L0.334735 14.049C-0.111578 14.4953 -0.111578 15.219 0.334735 15.6653C0.781049 16.1116 1.50467 16.1116 1.95098 15.6653L8 9.61625L14.049 15.6653C14.4953 16.1116 15.219 16.1116 15.6653 15.6653C16.1116 15.219 16.1116 14.4953 15.6653 14.049L9.61625 8L15.6653 1.95098Z" fill="#666666" />
                            </g>
                            <defs>
                                <clipPath id="clip0">
                                    <rect width="16" height="16" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </button>
                </div>
                <div className="modal_container">
                    <div className="modal_region">
                        {Object.keys(groupedMegaMap).map(group => (
                            <button
                                key={group}
                                onClick={() => handleRegionSelect(group)}
                                className={selectedGroup === group ? 'selected' : ''}
                            >
                                {group}
                            </button>
                        ))}
                    </div>
                    <div className="modal_detail">
                        {filteredCityFullNames.length > 0 ? (
                            filteredCityFullNames.map(name => (
                                <div
                                    key={name}
                                    className={`item ${selectedCityFullName === name ? 'selected' : ''}`}
                                    onClick={() => handleCityClick(name)}
                                >
                                    {name}
                                </div>
                            ))
                        ) : (
                            <div className="item">로딩 중...</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}