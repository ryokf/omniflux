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
        case 1: return { icon: '🍽️', color: '#FF9F43', name: 'Makanan' }; // Food
        case 2: return { icon: '🚗', color: '#00CFE8', name: 'Transportasi' }; // Transport
        case 3: return { icon: '🛍️', color: '#EA5455', name: 'Belanja' }; // Shopping
        case 4: return { icon: '🎬', color: '#7367F0', name: 'Hiburan' }; // Entertainment
        case 5: return { icon: '🏥', color: '#28C76F', name: 'Kesehatan' }; // Health
        case 6: return { icon: '🎓', color: '#FFB64D', name: 'Pendidikan' }; // Edu
        case 7: return { icon: '💰', color: '#28C76F', name: 'Gaji' }; // Salary
        case 8: return { icon: '📈', color: '#00CFE8', name: 'Investasi' }; // Invest
        default: return { icon: '📝', color: '#A8AAAE', name: 'Lainnya' }; // Default
    }
};
