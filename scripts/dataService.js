// Data service for loading and processing customer satisfaction data
const DataService = (() => {
    let customerData = null;

    async function loadData() {
        try {
            const response = await fetch('data/customer_satisfaction.csv');
            const csvText = await response.text();
            customerData = parseCSV(csvText);
            return customerData;
        } catch (error) {
            console.error('Error loading data:', error);
            // Fallback to sample data if file loading fails
            customerData = generateSampleData();
            return customerData;
        }
    }

    function parseCSV(csvText) {
        const lines = csvText.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim());
        
        const data = {
            customers: lines.slice(1).map(line => {
                const values = line.split(',');
                const obj = {};
                headers.forEach((header, index) => {
                    let value = values[index] ? values[index].trim() : '';
                    // Convert numeric values
                    if (!isNaN(value) && value !== '') {
                        value = Number(value);
                    }
                    obj[header] = value;
                });
                return obj;
            })
        };
        
        return data;
    }

    function generateSampleData() {
        // Generate sample data for development
        const sampleData = {
            customers: Array.from({ length: 100 }, (_, i) => ({
                id: i,
                Gender: Math.random() > 0.5 ? 'Male' : 'Female',
                'Customer Type': Math.random() > 0.3 ? 'Loyal Customer' : 'disloyal Customer',
                Age: Math.floor(Math.random() * 50) + 20,
                'Type of Travel': Math.random() > 0.4 ? 'Business travel' : 'Personal Travel',
                Class: ['Eco', 'Business', 'Eco Plus'][Math.floor(Math.random() * 3)],
                'Flight Distance': Math.floor(Math.random() * 4000),
                satisfaction: Math.random() > 0.5 ? 'satisfied' : 'neutral or dissatisfied',
                'Total Departure and Arrival Delay in Minutes': Math.floor(Math.random() * 200)
            }))
        };
        return sampleData;
    }

    function getData() {
        return customerData;
    }

    function filterData(filters) {
        if (!customerData) return null;
        
        let filtered = customerData.customers;
        Object.keys(filters).forEach(key => {
            if (filters[key] !== undefined && filters[key] !== null) {
                filtered = filtered.filter(customer => customer[key] === filters[key]);
            }
        });
        
        return { customers: filtered };
    }

    return {
        loadData,
        getData,
        filterData
    };
})();