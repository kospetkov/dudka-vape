import { useState } from 'react';
import '../pages/ProductPage.css';

const ProductGallery = ({ images, productName }) => {
    const [activeImage, setActiveImage] = useState(0);

    // Placeholder if no images
    const displayImages = images && images.length > 0
        ? images
        : [{ url: 'https://placehold.co/600x600/1a1a1a/ffffff?text=No+Image' }];

    return (
        <div className="product-gallery">
            <div className="main-image-container">
                <img
                    src={displayImages[activeImage].url}
                    alt={`${productName} - View ${activeImage + 1}`}
                    className="main-image"
                />
            </div>

            {displayImages.length > 1 && (
                <div className="thumbnails-grid">
                    {displayImages.map((img, index) => (
                        <button
                            key={index}
                            className={`thumbnail-btn ${activeImage === index ? 'active' : ''}`}
                            onClick={() => setActiveImage(index)}
                        >
                            <img
                                src={img.url}
                                alt={`Thumbnail ${index + 1}`}
                                className="thumbnail-img"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductGallery;
