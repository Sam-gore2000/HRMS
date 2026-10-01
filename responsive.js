/* ========================================
   DYNAMIC TABLE WIDTH HANDLER
   Automatically adjusts table behavior based on number of columns
======================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // Only run on mobile/tablet
    if (window.innerWidth <= 991) {
        handleTableResponsiveness();
    }
    
    // Re-run on window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth <= 991) {
                handleTableResponsiveness();
            }
        }, 250);
    });
});

function handleTableResponsiveness() {
    // Find all tables
    const tables = document.querySelectorAll('.main .table');
    
    tables.forEach(function(table) {
        // Count columns
        const headerRow = table.querySelector('thead tr');
        if (!headerRow) return;
        
        const columnCount = headerRow.querySelectorAll('th').length;
        
        // Get parent card-body
        const cardBody = table.closest('.card-body');
        if (!cardBody) return;
        
        // Calculate if table needs scrolling
        const containerWidth = cardBody.offsetWidth;
        
        // Estimate minimum column width based on content
        const estimatedMinColWidth = 80; // pixels per column minimum
        const estimatedTableWidth = columnCount * estimatedMinColWidth;
        
        // Determine behavior based on column count and screen size
        let behavior = determineTableBehavior(columnCount, estimatedTableWidth, containerWidth);
        
        // Apply appropriate class
        table.classList.remove('table-scroll', 'table-compact', 'table-minimal');
        table.classList.add(behavior.class);
        
        // Add data attributes for debugging
        table.setAttribute('data-columns', columnCount);
        table.setAttribute('data-behavior', behavior.class);
        
        // Show scroll hint if needed
        if (behavior.needsScroll && !cardBody.classList.contains('scrolled')) {
            addScrollHint(cardBody, columnCount);
        }
    });
}

function determineTableBehavior(columnCount, estimatedWidth, containerWidth) {
    // Small tables (1-3 columns) - fit naturally
    if (columnCount <= 3) {
        return {
            class: 'table-compact',
            needsScroll: false
        };
    }
    
    // Medium tables (4-5 columns) - compact but may scroll
    if (columnCount <= 5) {
        if (estimatedWidth > containerWidth) {
            return {
                class: 'table-scroll',
                needsScroll: true
            };
        }
        return {
            class: 'table-compact',
            needsScroll: false
        };
    }
    
    // Large tables (6+ columns) - definitely need scroll
    return {
        class: 'table-scroll',
        needsScroll: true
    };
}

function addScrollHint(cardBody, columnCount) {
    // Remove existing hint
    // const existingHint = cardBody.querySelector('.table-scroll-hint');
    // if (existingHint) {
    //     existingHint.remove();
    // }
    
    // Create hint
    // const hint = document.createElement('div');
    // hint.className = 'table-scroll-hint';
    // hint.innerHTML = `<i class="bi bi-arrow-left-right"></i> Scroll to see all ${columnCount} columns`;
    
    // Add hint
    // cardBody.appendChild(hint);
    
    // Remove hint after first scroll
    // cardBody.addEventListener('scroll', function() {
    //     hint.remove();
    //     this.classList.add('scrolled');
    // }, { once: true });
}

// Optional: Add column visibility toggle for very wide tables
function addColumnToggle(table) {
    const columnCount = table.querySelectorAll('thead th').length;
    
    // Only for tables with 8+ columns
    if (columnCount < 8) return;
    
    const cardBody = table.closest('.card-body');
    if (!cardBody) return;
    
    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'btn btn-sm btn-outline-secondary column-toggle-btn';
    toggleBtn.innerHTML = '<i class="bi bi-layout-three-columns"></i> Show/Hide Columns';
    toggleBtn.style.marginBottom = '10px';
    
    // Insert before table
    cardBody.insertBefore(toggleBtn, table);
    
    // Add click handler (you can customize which columns to hide)
    toggleBtn.addEventListener('click', function() {
        table.classList.toggle('hide-secondary-columns');
    });
}