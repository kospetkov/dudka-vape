import PropTypes from 'prop-types';
import './DiscountTag.css';

const DiscountTag = ({ type = 'discount', value, className = '' }) => {
    const getTagConfig = () => {
        switch (type) {
            case 'new':
                return {
                    text: 'NEW',
                    className: 'discount-tag-new',
                    glow: 'var(--glow-cyan)'
                };
            case 'hot':
                return {
                    text: 'HOT',
                    className: 'discount-tag-hot',
                    glow: 'var(--glow-pink)'
                };
            case 'premium':
                return {
                    text: 'PREMIUM',
                    className: 'discount-tag-premium',
                    glow: 'var(--glow-purple)'
                };
            case 'discount':
            default:
                return {
                    text: value ? `-${value}%` : '-20%',
                    className: 'discount-tag-discount',
                    glow: 'var(--glow-yellow)'
                };
        }
    };

    const config = getTagConfig();

    return (
        <div
            className={`discount-tag ${config.className} ${className}`}
            style={{ boxShadow: config.glow }}
        >
            {config.text}
        </div>
    );
};

DiscountTag.propTypes = {
    type: PropTypes.oneOf(['discount', 'new', 'hot', 'premium']),
    value: PropTypes.number,
    className: PropTypes.string
};

export default DiscountTag;
