import React, { useState } from "react";

interface CheckboxProps {
    checked: boolean
}

const Checkbox: React.FC<CheckboxProps> = ({ checked }) => {
    return (
        <button className="border border-dark w-4 h-4 relative">
            {
                checked ?
                <svg className="mb-1" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                    <polyline points="410 122 186 378 90 282" stroke="#FFF" strokeWidth="32px"></polyline>
                </svg>
                : null
            }
        </button>
    );
}

export default Checkbox;