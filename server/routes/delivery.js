import express from 'express';

const router = express.Router();

/**
 * Nova Poshta Integration Routes
 * Documentation: https://developers.novaposhta.ua/
 * API Endpoint: https://api.novaposhta.ua/v2.0/json/
 * 
 * Required ENV variable:
 * - NOVAPOSHTA_API_KEY
 */

const NP_API_URL = 'https://api.novaposhta.ua/v2.0/json/';

// Helper: Make API request to Nova Poshta
const npRequest = async (modelName, calledMethod, methodProperties = {}) => {
    const apiKey = process.env.NOVAPOSHTA_API_KEY || 'YOUR_API_KEY';
    
    // Check if API key is configured
    if (apiKey === 'YOUR_API_KEY') {
        return {
            success: false,
            demo: true,
            message: 'Nova Poshta API not configured'
        };
    }

    const response = await fetch(NP_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            apiKey: apiKey,
            modelName: modelName,
            calledMethod: calledMethod,
            methodProperties: methodProperties
        })
    });

    return response.json();
};

// @route   GET /api/delivery/cities
// @desc    Get list of cities
// @access  Public
router.get('/cities', async (req, res) => {
    try {
        const { search, limit = 20 } = req.query;

        // Check if API is configured
        const apiKey = process.env.NOVAPOSHTA_API_KEY;
        
        if (!apiKey || apiKey === 'YOUR_API_KEY') {
            // Return mock data for demo
            const mockCities = [
                { Ref: '8d5a980d-391c-11dd-90d9-001a92567626', Description: 'Київ', DescriptionRu: 'Киев' },
                { Ref: 'db5c88e0-391c-11dd-90d9-001a92567626', Description: 'Харків', DescriptionRu: 'Харьков' },
                { Ref: 'db5c88f5-391c-11dd-90d9-001a92567626', Description: 'Одеса', DescriptionRu: 'Одесса' },
                { Ref: 'db5c88c6-391c-11dd-90d9-001a92567626', Description: 'Дніпро', DescriptionRu: 'Днепр' },
                { Ref: 'db5c890d-391c-11dd-90d9-001a92567626', Description: 'Львів', DescriptionRu: 'Львов' },
                { Ref: 'db5c88de-391c-11dd-90d9-001a92567626', Description: 'Запоріжжя', DescriptionRu: 'Запорожье' },
                { Ref: 'db5c88d0-391c-11dd-90d9-001a92567626', Description: 'Вінниця', DescriptionRu: 'Винница' },
                { Ref: 'db5c88e5-391c-11dd-90d9-001a92567626', Description: 'Полтава', DescriptionRu: 'Полтава' },
                { Ref: 'db5c88ce-391c-11dd-90d9-001a92567626', Description: 'Чернігів', DescriptionRu: 'Чернигов' },
                { Ref: 'db5c890c-391c-11dd-90d9-001a92567626', Description: 'Черкаси', DescriptionRu: 'Черкассы' }
            ];

            let filtered = mockCities;
            if (search) {
                const searchLower = search.toLowerCase();
                filtered = mockCities.filter(city => 
                    city.Description.toLowerCase().includes(searchLower) ||
                    city.DescriptionRu.toLowerCase().includes(searchLower)
                );
            }

            return res.json({
                success: true,
                demo: true,
                data: filtered.slice(0, limit)
            });
        }

        // Real API call
        const methodProperties = {
            Limit: limit
        };
        
        if (search) {
            methodProperties.FindByString = search;
        }

        const result = await npRequest('Address', 'getCities', methodProperties);

        res.json({
            success: result.success,
            data: result.data || [],
            errors: result.errors
        });

    } catch (error) {
        console.error('Nova Poshta cities error:', error);
        res.status(500).json({ message: 'Error fetching cities' });
    }
});

// @route   GET /api/delivery/warehouses
// @desc    Get warehouses by city
// @access  Public
router.get('/warehouses', async (req, res) => {
    try {
        const { cityRef, search, limit = 50 } = req.query;

        if (!cityRef) {
            return res.status(400).json({ message: 'cityRef is required' });
        }

        // Check if API is configured
        const apiKey = process.env.NOVAPOSHTA_API_KEY;
        
        if (!apiKey || apiKey === 'YOUR_API_KEY') {
            // Return mock data for demo
            const mockWarehouses = {
                '8d5a980d-391c-11dd-90d9-001a92567626': [ // Kyiv
                    { Ref: 'wh1', Description: 'Відділення №1: вул. Хрещатик, 22', Number: '1' },
                    { Ref: 'wh2', Description: 'Відділення №2: вул. Велика Васильківська, 100', Number: '2' },
                    { Ref: 'wh3', Description: 'Відділення №3: пр. Перемоги, 50', Number: '3' },
                    { Ref: 'wh4', Description: 'Поштомат №101: ТРЦ Ocean Plaza', Number: '101' },
                    { Ref: 'wh5', Description: 'Поштомат №102: ТРЦ Гулівер', Number: '102' }
                ],
                'db5c88e0-391c-11dd-90d9-001a92567626': [ // Kharkiv
                    { Ref: 'wh10', Description: 'Відділення №1: вул. Сумська, 25', Number: '1' },
                    { Ref: 'wh11', Description: 'Відділення №2: пр. Науки, 14', Number: '2' },
                    { Ref: 'wh12', Description: 'Поштомат №50: ТРЦ Nikolsky', Number: '50' }
                ]
            };

            const warehouses = mockWarehouses[cityRef] || [
                { Ref: 'wh-default', Description: 'Відділення №1: Центральне', Number: '1' },
                { Ref: 'wh-default2', Description: 'Відділення №2', Number: '2' }
            ];

            let filtered = warehouses;
            if (search) {
                const searchLower = search.toLowerCase();
                filtered = warehouses.filter(wh => 
                    wh.Description.toLowerCase().includes(searchLower)
                );
            }

            return res.json({
                success: true,
                demo: true,
                data: filtered.slice(0, limit)
            });
        }

        // Real API call
        const result = await npRequest('Address', 'getWarehouses', {
            CityRef: cityRef,
            Limit: limit,
            FindByString: search || ''
        });

        res.json({
            success: result.success,
            data: result.data || [],
            errors: result.errors
        });

    } catch (error) {
        console.error('Nova Poshta warehouses error:', error);
        res.status(500).json({ message: 'Error fetching warehouses' });
    }
});

// @route   POST /api/delivery/calculate
// @desc    Calculate delivery cost
// @access  Public
router.post('/calculate', async (req, res) => {
    try {
        const { citySender, cityRecipient, weight, serviceType = 'WarehouseWarehouse' } = req.body;

        // Check if API is configured
        const apiKey = process.env.NOVAPOSHTA_API_KEY;
        
        if (!apiKey || apiKey === 'YOUR_API_KEY') {
            // Return mock calculation
            const baseCost = 50; // Base delivery cost in UAH
            const weightCost = Math.ceil(weight || 1) * 10;
            
            return res.json({
                success: true,
                demo: true,
                data: [{
                    Cost: baseCost + weightCost,
                    AssessedCost: 0,
                    CostRedelivery: 0
                }]
            });
        }

        // Real API call
        const result = await npRequest('InternetDocument', 'getDocumentPrice', {
            CitySender: citySender,
            CityRecipient: cityRecipient,
            Weight: weight || '1',
            ServiceType: serviceType,
            Cost: '100',
            CargoType: 'Parcel',
            SeatsAmount: '1'
        });

        res.json({
            success: result.success,
            data: result.data || [],
            errors: result.errors
        });

    } catch (error) {
        console.error('Nova Poshta calculate error:', error);
        res.status(500).json({ message: 'Error calculating delivery' });
    }
});

// @route   GET /api/delivery/track/:trackingNumber
// @desc    Track shipment
// @access  Public
router.get('/track/:trackingNumber', async (req, res) => {
    try {
        const { trackingNumber } = req.params;

        // Check if API is configured
        const apiKey = process.env.NOVAPOSHTA_API_KEY;
        
        if (!apiKey || apiKey === 'YOUR_API_KEY') {
            return res.json({
                success: true,
                demo: true,
                data: [{
                    Number: trackingNumber,
                    Status: 'Демо режим: відстеження недоступне',
                    StatusCode: '0'
                }]
            });
        }

        // Real API call
        const result = await npRequest('TrackingDocument', 'getStatusDocuments', {
            Documents: [{ DocumentNumber: trackingNumber }]
        });

        res.json({
            success: result.success,
            data: result.data || [],
            errors: result.errors
        });

    } catch (error) {
        console.error('Nova Poshta tracking error:', error);
        res.status(500).json({ message: 'Error tracking shipment' });
    }
});

export default router;
