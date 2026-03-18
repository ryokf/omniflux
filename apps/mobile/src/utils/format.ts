export const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

export const formatCompactRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(value);
};

export const getCategoryIcon = (categoryId: number | string) => {
    // A simplified generic fallback for categories until full category dictionary is loaded in context
    const id = Number(categoryId);
    switch (id) {
        case 1: return { icon: '🍽️', color: '#FF9F43' }; // Food
        case 2: return { icon: '🚗', color: '#00CFE8' }; // Transport
        case 3: return { icon: '🛍️', color: '#EA5455' }; // Shopping
        case 4: return { icon: '🎬', color: '#7367F0' }; // Entertainment
        case 5: return { icon: '🏥', color: '#28C76F' }; // Health
        case 6: return { icon: '🎓', color: '#FFB64D' }; // Edu
        case 7: return { icon: '💰', color: '#28C76F' }; // Salary
        case 8: return { icon: '📈', color: '#00CFE8' }; // Invest
        default: return { icon: '📝', color: '#A8AAAE' }; // Default
    }
};
