import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Image {
    id: string;
    urls: {
        small: string;
    };
    alt_description: string;
}

type ErrorType = 'RATE_LIMIT' | 'NETWORK' | 'API' | 'UNKNOWN';

interface FetchError {
    type: ErrorType;
    message: string;
}

const ImagePage: React.FC = () => {
    const [images, setImages] = useState<Image[]>([]);
    const [error, setError] = useState<FetchError | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const BASEURL = 'https://api.unsplash.com';
    const ACCESS_KEY = 'HxIKWiG902cRmnd6uzTua7bfWd4gzqWO84sGAc0GK4s';

    useEffect(() => {
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        const fetchImages = async (retryCount = 0) => {
            try {
                const response = await axios.get(`${BASEURL}/photos/random`, {
                    headers: {
                        Authorization: `Client-ID ${ACCESS_KEY}`
                    },
                    params: {
                        count: 4
                    },
                });
                setImages(response.data);
                setLoading(false);
            } catch (error) {
                let fetchError: FetchError;

                if (axios.isAxiosError(error)) {
                    if (error.response) {
                        if (error.response.status === 403) { // Rate limit exceeded
                            const retryAfter = parseInt(error.response.headers['retry-after'], 10) || 60; // Retry after header or default to 60 seconds
                            fetchError = {
                                type: 'RATE_LIMIT',
                                message: `Rate limit exceeded. Retrying after ${retryAfter} seconds.`
                            };

                            // Avoid infinite recursion by limiting retries
                            if (retryCount < 3) { // Retry limit
                                await delay(retryAfter * 1000);
                                fetchImages(retryCount + 1); // Retry fetching images
                            } else {
                                setError({
                                    type: 'RATE_LIMIT',
                                    message: 'Failed to get Images after several retries.'
                                });
                                setLoading(false);
                            }
                        } else { // Other API errors
                            fetchError = {
                                type: 'API',
                                message: `API Error: ${error.response.data?.message || 'Unknown error'}`
                            };
                        }
                    } else { // Network errors
                        fetchError = {
                            type: 'NETWORK',
                            message: 'Network Error: Unable to reach the API.'
                        };
                    }
                } else { // Unknown errors
                    fetchError = {
                        type: 'UNKNOWN',
                        message: 'An unknown error occurred.'
                    };
                }

                setError(fetchError);
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    if (loading) return <p>Loading Images...</p>;

    if (error) {
        let errorMessage: string;
        switch (error.type) {
            case 'RATE_LIMIT':
                errorMessage = `Rate Limit Exceeded: ${error.message}`;
                break;
            case 'NETWORK':
                errorMessage = `Network Error: ${error.message}`;
                break;
            case 'API':
                errorMessage = `API Error: ${error.message}`;
                break;
            default:
                errorMessage = `Unknown Error: ${error.message}`;
                break;
        }
        return <p>{errorMessage}</p>;
    }

    return (
        <main>
            <div className='flex flex-col gap-4 mb-4 items-center justify-center text-4xl sm:4xl pt-[40px]'>
                <h2 className="mx-10 md:text-2xl text-white font-bold">
                    <span className="animate-pulse text-blue-500 md:text-4xl">Welcome</span> to your image generator
                </h2>

            </div>
            <h2 className='text-white text-center md:text-4xl sm:text-3xl'>Pick any random image you love and create your THANK YOU CARD with your Beutiful name on it 😁</h2>
            <div className='flex flex-row flex-wrap justify-center items-center gap-10 mt-20'>
                {images.map((image) => (
                    <div key={image.id} className="relative group overflow-hidden w-[18rem] h-[18rem]">
                        <img
                            src={image.urls.small}
                            alt={image.alt_description || 'Image'}
                            onClick={() => navigate(`/image/${image.id}`)}
                            className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-110"
                        />
                    </div>
                ))}
            </div>
        </main>
    );
};

export default ImagePage;
