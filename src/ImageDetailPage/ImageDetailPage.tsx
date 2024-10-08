import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Image {
    id: string;
    urls: {
        small: string;
    };
    alt_description: string;
}

const ImageDetailPage: React.FC = () => {
    const { id } = useParams();
    const [image, setImage] = useState<Image | null>(null);
    const [size, setSize] = useState<number>(20);
    const [error, setError] = useState<string | null>(null);
    const [text, setText] = useState<string>('');
    const [myText, setMyText] = useState<string>('');
    const [rangeLimits, setRangeLimits] = useState({ min: 77, max: 80 });
    const [textColor, setTextColor] = useState<string>('#ffffff'); // Default to white color

    const BASEURLN = 'https://api.unsplash.com/photos';
    const ACCESS_KEYS = 'HxIKWiG902cRmnd6uzTua7bfWd4gzqWO84sGAc0GK4s';

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await axios.get(`${BASEURLN}/${id}`, {
                    headers: {
                        Authorization: `Client-ID ${ACCESS_KEYS}`
                    },
                });

                setImage(response.data);
            } catch (error) {
                setError('Failed to fetch Images');
            }
        };
        fetchImage();
    }, [id]);

    useEffect(() => {
        const updateRangeLimits = () => {
            if (window.innerWidth >= 1024) {
                setRangeLimits({ min: 50, max: 55 }); 
                setSize(20);
            } else {
                setRangeLimits({ min: 77, max: 80 });
                setSize(77);
            }
        };
        updateRangeLimits();

        window.addEventListener('resize', updateRangeLimits);

        return () => {
            window.removeEventListener('resize', updateRangeLimits);
        };
    }, []);

    const handleDownload = async () => {
        if (image) {
            try {
                const img = new Image();
                img.crossOrigin = 'anonymous'; 
                img.src = image.urls.small;

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    if (ctx) {
                        canvas.width = img.width;
                        canvas.height = img.height;

                        ctx.drawImage(img, 0, 0);

                        ctx.font = '30px Arial';
                        ctx.fillStyle = textColor; // Use the selected color
                        ctx.textAlign = 'center'; 

                        ctx.textBaseline = 'top'; 
                        ctx.fillText(myText, canvas.width / 2, 20); 

                        ctx.textBaseline = 'top';
                        ctx.fillText(text, canvas.width / 2, 420);

                        canvas.toBlob((blob) => {
                            if (blob) {
                                const link = document.createElement('a');
                                link.href = URL.createObjectURL(blob);
                                link.download = `${image.id}.png`;
                                link.click();
                                URL.revokeObjectURL(link.href);
                            }
                        }, 'image/png');
                    }
                };
            } catch (error) {
                setError('Failed to download the image.');
            }
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    };

    const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMyText(event.target.value);
    };

    const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTextColor(event.target.value); // Update the text color state
    };

    if (!image) return (<p>Loading.....</p>);
    if (error) return (<p>Error Detected</p>);

    return (
        <div className="flex flex-col relative items-center justify-center p-10">
            <img
                src={image.urls.small}
                alt={image.alt_description || 'Image'}
                className="transition-transform duration-300 ease-in-out mb-4"
                style={{ width: `${size}%`, height: 'auto' }}
            />
            <input
                type="text"
                value={text}
                onChange={handleChange}
                placeholder="Enter your Name here .."
                className="border border-gray-300 p-2 mb-4 w-64"
            />
            <input
                type="text"
                value={myText}
                onChange={handleChangeText}
                placeholder={myText}
                className="border border-gray-300 p-2 mb-4 w-64"
            />
            <div className="flex flex-row items-center justify-center">
            <label htmlFor="size" className="mr-2 text-white">Choose color</label>
            <input 
                type="color" 
                value={textColor} 
                onChange={handleColorChange} 
                className="border border-gray-300 p-2 mb-4 w-16"
                title="Choose Text Color"
            />
            </div>
            
            <div className="mt-4">
                <label htmlFor="size" className="mr-2 text-white">Resize:</label>
                <input
                    id="size"
                    type="range"
                    min={rangeLimits.min}
                    max={rangeLimits.max}
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="w-60"
                />
                <span className="text-white">{size}%</span>
            </div>
            <button
                onClick={handleDownload}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
                Download Now
            </button>
        </div>
    );
};

export default ImageDetailPage;
