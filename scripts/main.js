// Main controller for initializing the dashboard
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Load data first
        const data = await DataService.loadData();
        console.log('Data loaded successfully:', data);

        // Initialize all charts with transition
        initializeCharts(data);
        
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        // Show error message to user
        const main = document.querySelector('.dashboard-main');
        main.innerHTML = '<div class="error-message" style="text-align: center; padding: 50px; color: #D63649;">Error loading dashboard data. Please try refreshing the page.</div>';
    }
});

function clearCharts() {
    document.querySelectorAll('.chart-container').forEach(container => {
        container.innerHTML = '';
    });
}

function initializeCharts(data) {
    clearCharts();
    // Initialize single value charts
    setTimeout(() => Chart7Loyal.init('#chart7-loyal', data), 100);
    setTimeout(() => Chart8Distance.init('#chart8-distance', data), 300);
    setTimeout(() => Chart9NoDelay.init('#chart9-nodelay', data), 500);

    // Initialize multi value charts with staggered loading for better visual effect
    setTimeout(() => Chart1Distance.init('#chart1-distance', data), 700);
    setTimeout(() => Chart2Proportion.init('#chart2-proportion', data), 900);
    setTimeout(() => Chart3Category.init('#chart3-category', data), 1100);
    setTimeout(() => Chart4Delay.init('#chart4-delay', data), 1300);
    setTimeout(() => Chart5SeatClass.init('#chart5-seatclass', data), 1500);
    setTimeout(() => Chart6Disloyal.init('#chart6-disloyal', data), 1700);
}

// Add responsive behavior with debounce to avoid rapid re-renders
let resizeTimeout;
window.addEventListener('resize', function() {
    const data = DataService.getData();
    if (!data) {
        return;
    }

    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        initializeCharts(data);
    }, 200);
});