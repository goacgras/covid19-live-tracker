import React from 'react'

import numeral from 'numeral';

import './Table.css';

const Table = ({ countries }) => {
    return (
        <div className="table">
            {countries.map(({ country, cases }) => (
                <ul key={Math.random()}>
                    <li>{country}</li>
                    <li>
                        <strong>{numeral(cases).format("0,0")}</strong>
                    </li>
                </ul>
            ))}
        </div>
    )
}

export default React.memo(Table)
