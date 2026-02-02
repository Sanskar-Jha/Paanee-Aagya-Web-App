import React from 'react';
import { areaList } from '../utils/areaList';

export default function SelectUserArea() {
    
    return (
        <>
            {areaList.map((selectArea, index) => (
                <option key={index} value={selectArea}>{selectArea}</option>
            ))}
        </>
    );
}