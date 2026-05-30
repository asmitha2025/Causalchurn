// ================= CausalChurn AI Core JavaScript visual Engine =================

// ================= SYNTHETIC CUSTOMER DATABASE =================
let customerDatabase = [
    {
        id: "C-82941",
        name: "Alexandra Sterling",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120",
        tier: "Enterprise Tier",
        tenure: "3.2y Tenure",
        monthlyCharges: "₹12,400",
        ltv: "$124,500",
        riskScore: 84.2,
        confidence: "High",
        topDriver: "Engagement",
        archetype: "Persuadable",
        recommendedAction: "Annual Discount (15%)",
        lift: "+24.2%",
        savedRevenue: "₹12,400",
        treatmentStatus: "checked", // completed
        narrative: "Customer likely to churn due to declining engagement (-14% month-over-month), high support ticket volume (3 critical escalations in 14 days), and a low NPS score (detractor state).",
        weights: [
            { name: "Support Ticket Frequency", val: 0.32, color: "var(--danger)" },
            { name: "NPS Score (Detractor)", val: 0.28, color: "var(--danger)" },
            { name: "Active User Decline", val: 0.15, color: "var(--danger)" },
            { name: "Contract Length", val: -0.12, color: "var(--success)" }
        ],
        shap: [
            { label: "Base Value", value: 0.21, type: "base", width: 40, left: 30 },
            { label: "Logins = 2", value: +0.15, type: "positive", width: 25, left: 70 },
            { label: "Tickets = 5", value: +0.25, type: "positive", width: 35, left: 95 },
            { label: "Region = EMEA", value: +0.11, type: "positive", width: 15, left: 130 },
            { label: "NPS = 3", value: +0.12, type: "positive", width: 20, left: 145 },
            { label: "Risk Result", value: 0.84, type: "result", width: 135, left: 30 }
        ],
        decayAnalysis: "User active minutes dropped from 450m/mo to 120m/mo over the last quarter. This follows a specific pattern seen in 85% of churned Enterprise accounts.",
        decayBenchmark: "-62% vs Average",
        frictionLogs: "Average time-to-resolution on critical support tickets has increased by 400%. The sentiment analysis in recent emails indicates elevated frustration levels.",
        frictionBenchmark: "Escalated to Success Lead",
        baselineRetention: 40.0,
        simulatedUplifts: {
            Discount: 24.5,
            Call: 18.5,
            Upgrade: 15.9,
            Email: 2.1,
            Reward: 12.8
        }
    },
    {
        id: "C-90123",
        name: "Marcus Vance",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120",
        tier: "Growth Tier",
        tenure: "1.4y Tenure",
        monthlyCharges: "₹4,200",
        ltv: "$42,000",
        riskScore: 32.1,
        confidence: "Medium",
        topDriver: "Support Tickets",
        archetype: "Sure Thing",
        recommendedAction: "Nurture Email Only",
        lift: "+2.1%",
        savedRevenue: "₹4,200",
        treatmentStatus: "clock", // scheduled
        narrative: "Customer maintains high core product metrics but experienced recent delays in custom API integration, triggering mild support ticket escalations.",
        weights: [
            { name: "Support Ticket SLA Delay", val: 0.22, color: "var(--danger)" },
            { name: "Core Feature Adoption", val: -0.18, color: "var(--success)" },
            { name: "Contract Type (Annual)", val: -0.15, color: "var(--success)" },
            { name: "Billing Issues", val: 0.05, color: "var(--danger)" }
        ],
        shap: [
            { label: "Base Value", value: 0.21, type: "base", width: 45, left: 30 },
            { label: "SLA Delay = True", value: +0.22, type: "positive", width: 30, left: 75 },
            { label: "Adoption = High", value: -0.18, type: "negative", width: 25, left: 80 },
            { label: "Contract = Annual", value: -0.15, type: "negative", width: 20, left: 60 },
            { label: "Risk Result", value: 0.32, type: "result", width: 50, left: 30 }
        ],
        decayAnalysis: "Active usage remains flat. No significant engagement decay observed. User continues to log in 15+ times weekly.",
        decayBenchmark: "+12% vs Average",
        frictionLogs: "Integration roadblocks solved by Support last week. Customer sentiment remains highly collaborative and positive.",
        frictionBenchmark: "SLA Restored - Stable",
        baselineRetention: 75.0,
        simulatedUplifts: {
            Discount: 1.2,
            Call: 3.5,
            Upgrade: 5.0,
            Email: 2.1,
            Reward: 1.8
        }
    },
    {
        id: "C-77412",
        name: "Elena Rostova",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
        tier: "Enterprise Tier",
        tenure: "4.5y Tenure",
        monthlyCharges: "₹18,500",
        ltv: "$185,000",
        riskScore: 92.5,
        confidence: "High",
        topDriver: "Product Adoption",
        archetype: "Lost Cause",
        recommendedAction: "Do Not Incentivize",
        lift: "-0.4%",
        savedRevenue: "₹0",
        treatmentStatus: "cross", // avoided
        narrative: "Customer exhibits persistent zero login activity across 45 consecutive days. Acquired by parent firm with independent software contracts, indicating systemic churn.",
        weights: [
            { name: "Inactivity Duration", val: 0.55, color: "var(--danger)" },
            { name: "NPS Detractor State", val: 0.22, color: "var(--danger)" },
            { name: "Account Size Change", val: 0.18, color: "var(--danger)" },
            { name: "Historical Value", val: -0.05, color: "var(--success)" }
        ],
        shap: [
            { label: "Base Value", value: 0.21, type: "base", width: 35, left: 30 },
            { label: "Inactivity = 45d", value: +0.55, type: "positive", width: 65, left: 65 },
            { label: "NPS = 1", value: +0.22, type: "positive", width: 25, left: 130 },
            { label: "Downsize = True", value: +0.18, type: "positive", width: 20, left: 155 },
            { label: "Risk Result", value: 0.92, type: "result", width: 145, left: 30 }
        ],
        decayAnalysis: "Usage dropped to absolute zero. Login counts reached 0 for both admin and seat layers over the active billing cycle.",
        decayBenchmark: "-100% vs Average",
        frictionLogs: "Friction stems from external consolidation. Client success manager logged three cancellation requests referencing direct contract merger.",
        frictionBenchmark: "Strict Cancel Warning",
        baselineRetention: 8.0,
        simulatedUplifts: {
            Discount: -0.2,
            Call: 0.5,
            Upgrade: -1.2,
            Email: -0.4,
            Reward: 0.1
        }
    },
    {
        id: "C-12984",
        name: "Nolan Briggs",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
        tier: "Startup Tier",
        tenure: "0.8y Tenure",
        monthlyCharges: "₹22,100",
        ltv: "$221,000",
        riskScore: 68.4,
        confidence: "High",
        topDriver: "Discount Abuse",
        archetype: "Do Not Disturb",
        recommendedAction: "Suppress Marketing",
        lift: "-12.8%",
        savedRevenue: "₹22,100",
        treatmentStatus: "checked",
        narrative: "Customer reacts highly negatively to aggressive email marketing. Last two automated outreach letters triggered opt-out flags and immediate billing review visits.",
        weights: [
            { name: "Email Open Reactivity", val: 0.38, color: "var(--danger)" },
            { name: "Unsubscribe Flags", val: 0.28, color: "var(--danger)" },
            { name: "NPS Score", val: 0.15, color: "var(--danger)" },
            { name: "High Seat Utilization", val: -0.22, color: "var(--success)" }
        ],
        shap: [
            { label: "Base Value", value: 0.21, type: "base", width: 45, left: 30 },
            { label: "Campaign Count = 8", value: +0.38, type: "positive", width: 35, left: 75 },
            { label: "Optout Visited = True", value: +0.28, type: "positive", width: 25, left: 110 },
            { label: "Utilization = 92%", value: -0.22, type: "negative", width: 20, left: 115 },
            { label: "Risk Result", value: 0.68, type: "result", width: 105, left: 30 }
        ],
        decayAnalysis: "Active seat logs are extremely strong (92% utilization rate), showing high product dependence. Churn risk is purely emotional/outreach-triggered.",
        decayBenchmark: "+44% vs Average",
        frictionLogs: "Administrative frustration with constant bulk communications. Sentiment analysis highlights the word 'annoyed' repeated in user logs.",
        frictionBenchmark: "Opt-Out Flag Imminent",
        baselineRetention: 55.0,
        simulatedUplifts: {
            Discount: -8.5,
            Call: -5.0,
            Upgrade: -4.2,
            Email: -12.8,
            Reward: -3.0
        }
    },
    {
        id: "C-44512",
        name: "Genevieve Dubois",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
        tier: "Enterprise Tier",
        tenure: "2.1y Tenure",
        monthlyCharges: "₹9,800",
        ltv: "$98,000",
        riskScore: 76.8,
        confidence: "High",
        topDriver: "Support Tickets",
        archetype: "Persuadable",
        recommendedAction: "Direct Support Outreach",
        lift: "+31.2%",
        savedRevenue: "₹9,800",
        treatmentStatus: "checked",
        narrative: "Customer likely to churn due to high support friction. Critical ticketing pipeline shows unresolved integration items pending for over 20 business days.",
        weights: [
            { name: "Open Integration Ticket", val: 0.44, color: "var(--danger)" },
            { name: "Unresolved Tickets", val: 0.32, color: "var(--danger)" },
            { name: "Active Seat Utilization", val: -0.15, color: "var(--success)" },
            { name: "Contract Size", val: 0.08, color: "var(--danger)" }
        ],
        shap: [
            { label: "Base Value", value: 0.21, type: "base", width: 40, left: 30 },
            { label: "Open Integration = 1", value: +0.44, type: "positive", width: 45, left: 70 },
            { label: "Tickets = 8", value: +0.32, type: "positive", width: 35, left: 115 },
            { label: "Seats = 82%", value: -0.15, type: "negative", width: 15, left: 135 },
            { label: "Risk Result", value: 0.76, type: "result", width: 120, left: 30 }
        ],
        decayAnalysis: "Usage remains solid across major platform hubs. However, integration latency has blocked product deployment to the broader marketing cohort.",
        decayBenchmark: "-10% vs Average",
        frictionLogs: "Ticketing bottleneck. Active conversation with IT admins reports a severe database link problem. Solving this yields immediate positive response.",
        frictionBenchmark: "Escalated to Support Lead",
        baselineRetention: 35.0,
        simulatedUplifts: {
            Discount: 8.5,
            Call: 31.2,
            Upgrade: 12.0,
            Email: 1.5,
            Reward: 10.0
        }
    },
    {
        id: "C-15430",
        name: "Devin Kothari",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120",
        tier: "Growth Tier",
        tenure: "1.1y Tenure",
        monthlyCharges: "₹7,200",
        ltv: "$72,000",
        riskScore: 54.5,
        confidence: "Medium",
        topDriver: "Plan Limits",
        archetype: "Persuadable",
        recommendedAction: "Priority Access Upgrade",
        lift: "+15.9%",
        savedRevenue: "₹7,200",
        treatmentStatus: "checked",
        narrative: "Customer hits plan execution bounds three times this month. Churn risk triggered by product capacity warnings rather than core dissatisfaction.",
        weights: [
            { name: "Limit Overflows (30d)", val: 0.35, color: "var(--danger)" },
            { name: "Monthly Active Users", val: 0.22, color: "var(--danger)" },
            { name: "NPS High Rating", val: -0.28, color: "var(--success)" },
            { name: "API Error rate", val: 0.05, color: "var(--danger)" }
        ],
        shap: [
            { label: "Base Value", value: 0.21, type: "base", width: 40, left: 30 },
            { label: "Overflows = 3", value: +0.35, type: "positive", width: 35, left: 70 },
            { label: "NPS = 9", value: -0.28, type: "negative", width: 25, left: 80 },
            { label: "Users = High", value: +0.22, type: "positive", width: 20, left: 100 },
            { label: "Risk Result", value: 0.54, type: "result", width: 75, left: 30 }
        ],
        decayAnalysis: "Active seat growth is exponential (+45% MoM). The account is bursting at the seams, creating direct performance alerts.",
        decayBenchmark: "+180% vs Average",
        frictionLogs: "Account admins are satisfied with the software but find pricing upgrades restrictive. Direct upgrade incentives yield very high retention.",
        frictionBenchmark: "SLA Normal - Expansion",
        baselineRetention: 50.0,
        simulatedUplifts: {
            Discount: 4.5,
            Call: 12.0,
            Upgrade: 15.9,
            Email: -0.5,
            Reward: 8.5
        }
    }
];

// ================= GLOBAL STATE =================
let activeCustomer = customerDatabase[0];
let currentTheme = "light-mode";

// ================= DOM ELEMENT REFERENCES =================
const elements = {
    // Navigation
    navItems: document.querySelectorAll(".nav-item[data-page]"),
    pages: document.querySelectorAll(".page"),
    breadcrumbsId: document.getElementById("explain-breadcrumbs-id"),

    // Global Components
    themeToggleBtn: document.getElementById("theme-toggle-btn"),
    globalSearch: document.getElementById("global-search"),
    notifBtn: document.getElementById("notif-btn"),

    // Table elements
    tableBody: document.querySelector("#customer-table tbody"),
    tableFilterArchetype: document.getElementById("table-filter-archetype"),
    tableSearchInput: document.getElementById("table-search-input"),
    exportCsvBtn: document.getElementById("export-csv-btn"),
    launchCampaignBtn: document.getElementById("launch-campaign-btn"),

    // Explainability center elements
    narrativeText: document.getElementById("narrative-text"),
    narrativeRiskVal: document.getElementById("narrative-risk-val"),
    narrativeConfVal: document.getElementById("narrative-conf-val"),
    narrativeDriverVal: document.getElementById("narrative-driver-val"),
    weightsBars: document.getElementById("weights-bars"),
    waterfallLabels: document.getElementById("waterfall-labels"),
    waterfallChartBody: document.getElementById("waterfall-chart-body"),
    decayText: document.getElementById("decay-text"),
    decayBenchmarkVal: document.getElementById("decay-benchmark-val"),
    frictionText: document.getElementById("friction-text"),
    frictionEscalationVal: document.getElementById("friction-escalation-val"),
    explainGenerateInsightsBtn: document.getElementById("explain-generate-insights-btn"),

    // Counterfactual simulation elements
    simCustomerSelect: document.getElementById("sim-customer-select"),
    simInterventionSelect: document.getElementById("sim-intervention-select"),
    simIntensityRange: document.getElementById("sim-intensity-range"),
    sliderIntensityValue: document.getElementById("slider-intensity-value"),
    runSimulationBtn: document.getElementById("run-simulation-btn"),
    entityAvatar: document.getElementById("entity-avatar"),
    entityName: document.getElementById("entity-name"),
    entityTierTenure: document.getElementById("entity-tier-tenure"),
    entityLtv: document.getElementById("entity-ltv"),
    entityRiskBadge: document.getElementById("entity-risk-badge"),
    projectionDeltaValue: document.getElementById("projection-delta-value"),
    currentRetentionRing: document.getElementById("current-retention-ring"),
    currentRetentionPct: document.getElementById("current-retention-pct"),
    currentRetentionDesc: document.getElementById("current-retention-desc"),
    simulatedRetentionRing: document.getElementById("simulated-retention-ring"),
    simulatedRetentionPct: document.getElementById("simulated-retention-pct"),
    simulatedRetentionDesc: document.getElementById("simulated-retention-desc"),
    horizonPathBaseline: document.getElementById("horizon-path-baseline"),
    horizonPathSimulated: document.getElementById("horizon-path-simulated"),
    simDownloadBtn: document.getElementById("sim-download-btn"),
    simCommitBtn: document.getElementById("sim-commit-btn"),

    // AI Copilot panel elements
    copilotDrawer: document.getElementById("copilot-drawer"),
    copilotOverlay: document.getElementById("copilot-overlay"),
    copilotNavTrigger: document.getElementById("copilot-nav-trigger"),
    headerCopilotTrigger: document.getElementById("header-copilot-trigger"),
    copilotCloseBtn: document.getElementById("copilot-close-btn"),
    copilotChatMessages: document.getElementById("copilot-chat-messages"),
    copilotChatInput: document.getElementById("copilot-chat-input"),
    copilotSendBtn: document.getElementById("copilot-send-btn"),
    suggestedQBtns: document.querySelectorAll(".suggest-q-btn")
};

// ================= SPA ROUTER AND NAVIGATION =================
function initRouter() {
    elements.navItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const pageId = item.getAttribute("data-page");
            switchPage(pageId);
        });
    });

    // Breadcrumbs click to switch page back to explorer
    document.querySelectorAll(".breadcrumbs .crumb.clickable").forEach(crumb => {
        crumb.addEventListener("click", () => {
            const pageId = crumb.getAttribute("data-target");
            switchPage(pageId);
        });
    });
}

function switchPage(pageId) {
    // Update active nav items
    elements.navItems.forEach(item => {
        if (item.getAttribute("data-page") === pageId) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });

    // Update active page containers
    elements.pages.forEach(page => {
        if (page.id === `page-${pageId}`) {
            page.classList.add("active");
        } else {
            page.classList.remove("active");
        }
    });

    // Run page specific load sequences
    if (pageId === "dashboard") {
        renderDecayChart();
    } else if (pageId === "explainability") {
        renderExplainabilityCenter();
    } else if (pageId === "counterfactual") {
        renderCounterfactualLab();
    }
}

// Toggle settings wrapper
function toggleSettings() {
    alert("Settings panel: Model Parameters Calibrated. Active Meta-Learner set to: X-Learner (CausalML Uber).");
}

// ================= GLOBAL ACTIONS =================
function initGlobalActions() {
    // Theme toggle
    elements.themeToggleBtn.addEventListener("click", () => {
        if (currentTheme === "light-mode") {
            currentTheme = "dark-mode";
            document.body.classList.replace("light-mode", "dark-mode");
            elements.themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        } else {
            currentTheme = "light-mode";
            document.body.classList.replace("dark-mode", "light-mode");
            elements.themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        }
        renderDecayChart(); // Redraw with new theme custom properties
    });

    // Global Search Auto-complete / selection routing
    elements.globalSearch.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            const query = elements.globalSearch.value.trim().toUpperCase();
            const customer = customerDatabase.find(c => c.id === query || c.name.toUpperCase().includes(query));
            if (customer) {
                setActiveCustomer(customer);
                switchPage("explainability");
                elements.globalSearch.value = "";
            } else {
                alert(`Customer "${query}" not found in current cohort. Try C-82941 or C-90123.`);
            }
        }
    });

    // Click trigger on notifications
    elements.notifBtn.addEventListener("click", () => {
        alert("Alert Logs:\n1. Uplift threshold breached for Power Users (Tier 1) segment.\n2. Scheduled batch retention campaign 'Loyalty Premium' is now running.\n3. Segment expansion detected in Growth level Persuadables.");
    });
}

// ================= ACTIVE ENTITY UPDATE SYSTEM =================
function setActiveCustomer(customer) {
    activeCustomer = customer;
    
    // Invalidate and refresh dropdown selectors
    if (elements.simCustomerSelect) {
        elements.simCustomerSelect.value = customer.id;
    }
    
    // Sync active breadcrumb
    if (elements.breadcrumbsId) {
        elements.breadcrumbsId.textContent = `${customer.id} Explanations`;
    }

    // Refresh UI blocks
    renderExplainabilityCenter();
    renderCounterfactualLab();
}

// ================= MODULE 03-10: DASHBOARD PAGE CONTROLLERS =================

// Churn Cohort Decay Chart
function renderDecayChart() {
    const container = elements.decayChart;
    if (!container) return;

    container.innerHTML = "";

    const cohorts = [
        { label: "M1 Cohort", pct: 90, tooltip: "90% retention at month 1" },
        { label: "M2 Cohort", pct: 78, tooltip: "78% retention at month 2" },
        { label: "M3 Cohort", pct: 64, tooltip: "64% retention at month 3" },
        { label: "M4 Cohort", pct: 52, tooltip: "52% retention at month 4" },
        { label: "M5 Cohort", pct: 40, tooltip: "40% retention at month 5" },
        { label: "M6 Cohort", pct: 32, tooltip: "32% retention at month 6" }
    ];

    cohorts.forEach(c => {
        const group = document.createElement("div");
        group.className = "chart-bar-group";

        const bar = document.createElement("div");
        bar.className = "chart-bar";
        bar.style.height = "0%";
        
        const tooltip = document.createElement("span");
        tooltip.className = "bar-tooltip";
        tooltip.textContent = c.tooltip;
        bar.appendChild(tooltip);

        const lbl = document.createElement("span");
        lbl.className = "bar-label";
        lbl.textContent = c.label;

        group.appendChild(bar);
        group.appendChild(lbl);
        container.appendChild(group);

        // Micro-timeout to trigger height transition animation
        setTimeout(() => {
            bar.style.height = `${c.pct}%`;
        }, 50);
    });
}

// Customer Intelligence Interactive Table
function renderCustomerTable() {
    const tbody = elements.tableBody;
    if (!tbody) return;

    tbody.innerHTML = "";

    // Apply Filter & Search queries
    const archetypeFilter = elements.tableFilterArchetype.value;
    const searchQuery = elements.tableSearchInput.value.trim().toUpperCase();

    const filtered = customerDatabase.filter(c => {
        const matchesArchetype = (archetypeFilter === "all") || (c.archetype === archetypeFilter);
        const matchesSearch = c.id.toUpperCase().includes(searchQuery) || c.name.toUpperCase().includes(searchQuery);
        return matchesArchetype && matchesSearch;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding: 24px; color: var(--text-secondary);">No customer profiles match your search filters.</td></tr>`;
        return;
    }

    filtered.forEach(c => {
        const row = document.createElement("tr");
        
        // Define archetype class mapping
        let archClass = "persuadable";
        if (c.archetype === "Sure Thing") archClass = "sure-thing";
        else if (c.archetype === "Lost Cause") archClass = "lost-cause";
        else if (c.archetype === "Do Not Disturb") archClass = "dnd";

        // Treatment status mapping icon
        let statusIcon = '<i class="fa-solid fa-circle-check text-emerald" style="font-size: 15px;"></i>';
        if (c.treatmentStatus === "clock") {
            statusIcon = '<i class="fa-regular fa-clock text-warning" style="font-size: 15px;"></i>';
        } else if (c.treatmentStatus === "cross") {
            statusIcon = '<i class="fa-solid fa-circle-xmark text-rose" style="font-size: 15px;"></i>';
        }

        row.innerHTML = `
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="${c.avatar}" style="width: 28px; height: 28px; border-radius: 9999px; object-fit: cover;">
                    <span style="font-weight: 700;">${c.id}</span>
                </div>
            </td>
            <td><span class="archetype-label ${archClass}">${c.archetype.toUpperCase()}</span></td>
            <td style="font-weight: 500;">${c.recommendedAction}</td>
            <td class="text-right text-emerald font-semibold" style="font-family: var(--font-display);">${c.lift}</td>
            <td class="text-right font-semibold" style="font-family: var(--font-display);">${c.savedRevenue}</td>
            <td class="text-center">${statusIcon}</td>
            <td class="text-center">
                <button class="explore-row-btn" data-id="${c.id}"><i class="fa-solid fa-arrow-right"></i></button>
            </td>
        `;

        // Handle Row-Clicks to switch and explore the selected customer
        row.addEventListener("click", (e) => {
            // Avoid conflict if they clicked the action button explicitly
            if (e.target.closest(".explore-row-btn")) return;
            setActiveCustomer(c);
            switchPage("explainability");
        });

        const btn = row.querySelector(".explore-row-btn");
        btn.addEventListener("click", () => {
            setActiveCustomer(c);
            switchPage("explainability");
        });

        tbody.appendChild(row);
    });
}

function initTableControls() {
    elements.tableFilterArchetype.addEventListener("change", renderCustomerTable);
    elements.tableSearchInput.addEventListener("input", renderCustomerTable);

    elements.exportCsvBtn.addEventListener("click", () => {
        alert("Success: Customer intelligence CSV report successfully generated and saved to 'data/processed/customer_recommendations.csv'!");
    });

    elements.launchCampaignBtn.addEventListener("click", () => {
        alert("Deployment Success: 2,410 Persuadable customers in this cohort targeted with tailored micro-campaign actions!");
    });
}

// ================= MODULE 09: EXPLAINABILITY CENTER =================
function renderExplainabilityCenter() {
    // 1. Set values & headers
    elements.narrativeText.innerHTML = activeCustomer.narrative;
    elements.narrativeRiskVal.textContent = `${activeCustomer.riskScore}%`;
    elements.narrativeConfVal.textContent = activeCustomer.confidence;
    elements.narrativeDriverVal.textContent = activeCustomer.topDriver;

    elements.decayText.textContent = activeCustomer.decayAnalysis;
    elements.decayBenchmarkVal.textContent = activeCustomer.decayBenchmark;
    elements.frictionText.textContent = activeCustomer.frictionLogs;
    elements.frictionEscalationVal.textContent = activeCustomer.frictionBenchmark;

    // Set benchmark alert colors
    if (activeCustomer.decayBenchmark.includes("-")) {
        elements.decayBenchmarkVal.className = "bench-value red-text";
    } else {
        elements.decayBenchmarkVal.className = "bench-value text-emerald";
    }

    if (activeCustomer.frictionBenchmark.includes("Escalated")) {
        elements.frictionEscalationVal.className = "bench-value red-badge";
    } else {
        elements.frictionEscalationVal.className = "bench-value archetype-label sure-thing";
    }

    // 2. Local feature weights bars rendering
    elements.weightsBars.innerHTML = "";
    activeCustomer.weights.forEach(w => {
        const row = document.createElement("div");
        row.className = "weight-row";

        const sign = w.val > 0 ? "+" : "";
        row.innerHTML = `
            <div class="weight-meta">
                <span class="weight-name">${w.name}</span>
                <span class="weight-val" style="color: ${w.color};">${sign}${w.val}</span>
            </div>
            <div class="weight-track">
                <div class="weight-fill" style="width: ${Math.abs(w.val) * 100}%; background-color: ${w.color};"></div>
            </div>
        `;
        elements.weightsBars.appendChild(row);
    });

    // 3. Local SHAP Waterfall Chart Rendering
    elements.waterfallLabels.innerHTML = "";
    elements.waterfallChartBody.innerHTML = "";

    activeCustomer.shap.forEach((s, idx) => {
        // Render label element
        const label = document.createElement("span");
        label.textContent = s.label;
        elements.waterfallLabels.appendChild(label);

        // Render bar element
        const barRow = document.createElement("div");
        barRow.className = "waterfall-bar-row";

        const sign = s.value > 0 ? "+" : "";
        let widthPct = s.width;
        let leftPct = s.left;

        // Custom styling for specific types
        let displayVal = `${sign}${s.value}`;
        let bgClass = s.type;
        if (s.type === "base") {
            displayVal = `Base: ${s.value}`;
        } else if (s.type === "result") {
            displayVal = `Result: ${s.value}`;
        }

        barRow.innerHTML = `
            <div class="wf-bar ${bgClass}" style="width: 0%; left: ${leftPct}%; opacity: 0;">
                ${displayVal}
            </div>
        `;

        // Connector dashed lines between waterfall blocks
        if (idx < activeCustomer.shap.length - 1) {
            const nextItem = activeCustomer.shap[idx + 1];
            const line = document.createElement("div");
            line.className = "wf-connector-line";
            
            // Connect line coordinate alignment
            if (s.value > 0) {
                line.style.left = `${s.left + s.width}%`;
            } else {
                line.style.left = `${s.left}%`;
            }
            barRow.appendChild(line);
        }

        elements.waterfallChartBody.appendChild(barRow);

        // Micro-timeout to animate bar expansion
        setTimeout(() => {
            const bar = barRow.querySelector(".wf-bar");
            if (bar) {
                bar.style.width = `${widthPct}%`;
                bar.style.opacity = "1";
            }
        }, 50);
    });
}

function initExplainabilityControls() {
    elements.explainGenerateInsightsBtn.addEventListener("click", () => {
        alert(`AI Explainer Insights for ${activeCustomer.id}:\n\n` + 
              `1. The predictive risk of ${activeCustomer.riskScore}% is heavily driven by support friction and declining login velocity.\n` + 
              `2. SHAP waterfall calculations indicate correcting the 'Support Ticket Frequency' will decrease overall churn probability by ~22.5% points.\n` + 
              `3. Target archetype is ${activeCustomer.archetype}. Direct intervention via '${activeCustomer.recommendedAction}' is expected to yield maximum ROI.`);
    });
}

// ================= MODULE 08-10: COUNTERFACTUAL SIMULATOR =================
function renderCounterfactualLab() {
    // Populate select selector dropdown if needed
    if (elements.simCustomerSelect.children.length === 0) {
        elements.simCustomerSelect.innerHTML = "";
        customerDatabase.forEach(c => {
            const opt = document.createElement("option");
            opt.value = c.id;
            opt.textContent = `${c.id} (${c.name})`;
            elements.simCustomerSelect.appendChild(opt);
        });
    }

    // Set Active Dropdown Customer
    elements.simCustomerSelect.value = activeCustomer.id;

    // Set Context Card details
    elements.entityAvatar.src = activeCustomer.avatar;
    elements.entityName.textContent = activeCustomer.name;
    elements.entityTierTenure.textContent = `${activeCustomer.tier} • ${activeCustomer.tenure}`;
    elements.entityLtv.textContent = activeCustomer.ltv;
    
    // Set risk level styling
    elements.entityRiskBadge.textContent = activeCustomer.riskScore > 75 ? "Critical" : activeCustomer.riskScore > 40 ? "Elevated" : "Normal";
    elements.entityRiskBadge.className = activeCustomer.riskScore > 75 ? "val text-danger" : activeCustomer.riskScore > 40 ? "val text-warning" : "val text-emerald";

    // Run active initial state simulator values
    calculateSimulation();
}

function calculateSimulation() {
    const proposed = elements.simInterventionSelect.value;
    const intensity = parseInt(elements.simIntensityRange.value);

    // Retrieve uplift CATE from customer uplifts mappings
    let liftVal = activeCustomer.simulatedUplifts[proposed] || 0.0;
    
    // Adjust based on slider intensity scaling
    let scaleFactor = intensity / 50.0; // 50 intensity is baseline 1x
    let calculatedLift = liftVal * scaleFactor;

    // Boundaries
    if (calculatedLift > 45) calculatedLift = 45;
    if (calculatedLift < -20) calculatedLift = -20;

    let deltaText = calculatedLift > 0 ? `+${calculatedLift.toFixed(1)}%` : `${calculatedLift.toFixed(1)}%`;
    elements.projectionDeltaValue.textContent = deltaText;
    
    // Set green/red metrics colors based on direction
    if (calculatedLift >= 0) {
        elements.projectionDeltaValue.className = "delta-value text-emerald";
    } else {
        elements.projectionDeltaValue.className = "delta-value text-danger";
    }

    // Calculate simulated outcomes
    let baselineRetention = activeCustomer.baselineRetention;
    let simulatedRetention = baselineRetention + calculatedLift;

    if (simulatedRetention > 100) simulatedRetention = 100;
    if (simulatedRetention < 0) simulatedRetention = 0;

    // 1. Render Current Retention Circle
    elements.currentRetentionPct.textContent = `${baselineRetention.toFixed(0)}%`;
    elements.currentRetentionDesc.innerHTML = activeCustomer.decayAnalysis;

    // 2. Render Simulated Retention Circle
    elements.simulatedRetentionPct.textContent = `${simulatedRetention.toFixed(0)}%`;
    
    // Inject appropriate prescriptive descriptions
    if (calculatedLift > 15) {
        elements.simulatedRetentionDesc.innerHTML = `Proposed **${proposed}** intervention successfully restores product trust and mitigates support-level bottlenecks.`;
    } else if (calculatedLift > 0) {
        elements.simulatedRetentionDesc.innerHTML = `Proposed **${proposed}** creates a marginal incremental recovery (+${calculatedLift.toFixed(1)}%), stabilizing account metrics.`;
    } else if (calculatedLift < 0) {
        elements.simulatedRetentionDesc.innerHTML = `Warning: Outreach **${proposed}** triggers negative segment reaction. Marketing saturation threshold breached.`;
    }

    // Circular ring stroke dashoffsets
    // Circumference = 314.16
    let currentOffset = 314.16 - (314.16 * (baselineRetention / 100));
    let simulatedOffset = 314.16 - (314.16 * (simulatedRetention / 100));

    elements.currentRetentionRing.style.strokeDashoffset = currentOffset;
    elements.simulatedRetentionRing.style.strokeDashoffset = simulatedOffset;

    // 3. Render 6-Month Projected Horizon Graph
    renderHorizonGraph(baselineRetention, simulatedRetention);
}

function renderHorizonGraph(baselineVal, simulatedVal) {
    const svg = elements.horizonPathBaseline.parentNode;
    
    // Build coordinate steps across 6 months
    // M1 - M6 coordinate mapping bounds: X goes from 20 to 420 (step of 80)
    // Y goes from 100 (0% retention) to 20 (100% retention)
    
    function mapValueToY(val) {
        // 100% -> 20, 0% -> 100.
        return 100 - (val * 80 / 100);
    }

    // Baseline decay path (gradual decay over 6 months)
    let b1 = baselineVal;
    let b2 = b1 * 0.9;
    let b3 = b2 * 0.85;
    let b4 = b3 * 0.8;
    let b5 = b4 * 0.8;
    let b6 = b5 * 0.75;

    let baseD = `M 20 ${mapValueToY(b1)} L 100 ${mapValueToY(b2)} L 180 ${mapValueToY(b3)} L 260 ${mapValueToY(b4)} L 340 ${mapValueToY(b5)} L 420 ${mapValueToY(b6)}`;
    elements.horizonPathBaseline.setAttribute("d", baseD);

    // Simulated recovery path
    let s1 = simulatedVal;
    let s2 = s1 * 0.98;
    let s3 = s2 * 0.96;
    let s4 = s3 * 0.95;
    let s5 = s4 * 0.95;
    let s6 = s5 * 0.94;

    let simD = `M 20 ${mapValueToY(s1)} L 100 ${mapValueToY(s2)} L 180 ${mapValueToY(s3)} L 260 ${mapValueToY(s4)} L 340 ${mapValueToY(s5)} L 420 ${mapValueToY(s6)}`;
    elements.horizonPathSimulated.setAttribute("d", simD);
}

function initCounterfactualControls() {
    // Slider live indicator updates
    elements.simIntensityRange.addEventListener("input", () => {
        elements.sliderIntensityValue.textContent = elements.simIntensityRange.value;
    });

    // Run Simulation button click - calls server-side causal Do-calculus SCM simulator
    elements.runSimulationBtn.addEventListener("click", () => {
        runSimulationOnServer();
    });

    // Customer selector change syncs active customer
    elements.simCustomerSelect.addEventListener("change", () => {
        const id = elements.simCustomerSelect.value;
        const customer = customerDatabase.find(c => c.id === id);
        if (customer) {
            setActiveCustomer(customer);
        }
    });

    elements.simDownloadBtn.addEventListener("click", () => {
        alert(`Success: Simulation report successfully compiled and downloaded for account ${activeCustomer.id}.`);
    });

    elements.simCommitBtn.addEventListener("click", () => {
        alert(`Action Deployed: Proposed ${elements.simInterventionSelect.value} committed to CRM workflow engine for customer ${activeCustomer.id}.`);
    });
}

// ================= DYNAMIC REST SERVER INTEGRATION ENGINE =================

async function runSimulationOnServer() {
    const proposed = elements.simInterventionSelect.value;
    const intensity = parseInt(elements.simIntensityRange.value);
    
    elements.runSimulationBtn.innerHTML = '<i class="fa-solid fa-arrows-spin fa-spin"></i> CALCULATING LIFT...';
    elements.runSimulationBtn.disabled = true;
    
    try {
        const response = await fetch("/roi", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                customer_id: activeCustomer.id,
                proposed_action: proposed,
                intensity: intensity
            })
        });
        
        if (!response.ok) {
            throw new Error("Failed to run causal simulation on server.");
        }
        
        const data = await response.json();
        const results = data.simulation_results;
        
        const calculatedLift = results.projection_delta;
        let deltaText = calculatedLift > 0 ? `+${calculatedLift.toFixed(1)}%` : `${calculatedLift.toFixed(1)}%`;
        elements.projectionDeltaValue.textContent = deltaText;
        
        if (calculatedLift >= 0) {
            elements.projectionDeltaValue.className = "delta-value text-emerald";
        } else {
            elements.projectionDeltaValue.className = "delta-value text-danger";
        }
        
        const baselineRetention = results.baseline_retention;
        const simulatedRetention = results.simulated_retention;
        
        elements.currentRetentionPct.textContent = `${baselineRetention.toFixed(0)}%`;
        elements.currentRetentionDesc.innerHTML = activeCustomer.decayAnalysis;
        
        elements.simulatedRetentionPct.textContent = `${simulatedRetention.toFixed(0)}%`;
        
        if (calculatedLift > 15) {
            elements.simulatedRetentionDesc.innerHTML = `Proposed **${proposed}** intervention successfully restores product trust and mitigates support-level bottlenecks.`;
        } else if (calculatedLift > 0) {
            elements.simulatedRetentionDesc.innerHTML = `Proposed **${proposed}** creates a marginal incremental recovery (+${calculatedLift.toFixed(1)}%), stabilizing account metrics.`;
        } else if (calculatedLift < 0) {
            elements.simulatedRetentionDesc.innerHTML = `Warning: Outreach **${proposed}** triggers negative segment reaction. Marketing saturation threshold breached.`;
        }
        
        let currentOffset = 314.16 - (314.16 * (baselineRetention / 100));
        let simulatedOffset = 314.16 - (314.16 * (simulatedRetention / 100));
        
        elements.currentRetentionRing.style.strokeDashoffset = currentOffset;
        elements.simulatedRetentionRing.style.strokeDashoffset = simulatedOffset;
        
        renderHorizonGraphWithArrays(results.baseline_horizon, results.simulated_horizon);
        
    } catch (err) {
        console.warn("Simulation REST error, falling back to local simulation:", err);
        calculateSimulation();
    } finally {
        elements.runSimulationBtn.innerHTML = '<i class="fa-solid fa-circle-play"></i> RUN SIMULATION';
        elements.runSimulationBtn.disabled = false;
    }
}

function renderHorizonGraphWithArrays(baselineHorizon, simulatedHorizon) {
    function mapValueToY(val) {
        return 100 - (val * 80 / 100);
    }
    
    let baseD = `M 20 ${mapValueToY(baselineHorizon[0])} L 100 ${mapValueToY(baselineHorizon[1])} L 180 ${mapValueToY(baselineHorizon[2])} L 260 ${mapValueToY(baselineHorizon[3])} L 340 ${mapValueToY(baselineHorizon[4])} L 420 ${mapValueToY(baselineHorizon[5])}`;
    elements.horizonPathBaseline.setAttribute("d", baseD);
    
    let simD = `M 20 ${mapValueToY(simulatedHorizon[0])} L 100 ${mapValueToY(simulatedHorizon[1])} L 180 ${mapValueToY(simulatedHorizon[2])} L 260 ${mapValueToY(simulatedHorizon[3])} L 340 ${mapValueToY(simulatedHorizon[4])} L 420 ${mapValueToY(simulatedHorizon[5])}`;
    elements.horizonPathSimulated.setAttribute("d", simD);
}

async function loadCustomerDataFromServer() {
    try {
        const response = await fetch("/customers");
        if (!response.ok) {
            throw new Error("Server returned non-200 status");
        }
        const data = await response.json();
        if (data && data.length > 0) {
            customerDatabase = data;
            
            // Re-sync active customer if they exist in the database
            const found = customerDatabase.find(c => c.id === activeCustomer.id);
            if (found) {
                activeCustomer = found;
            } else {
                activeCustomer = customerDatabase[0];
            }
            
            // Sync active customer in breadcrumbs
            if (elements.breadcrumbsId) {
                elements.breadcrumbsId.textContent = `${activeCustomer.id} Explanations`;
            }
            
            // Re-populate simCustomerSelect
            if (elements.simCustomerSelect) {
                elements.simCustomerSelect.innerHTML = "";
                customerDatabase.forEach(c => {
                    const opt = document.createElement("option");
                    opt.value = c.id;
                    opt.textContent = `${c.id} (${c.name})`;
                    elements.simCustomerSelect.appendChild(opt);
                });
                elements.simCustomerSelect.value = activeCustomer.id;
            }
            
            // Refresh visuals
            renderCustomerTable();
            renderExplainabilityCenter();
            renderCounterfactualLab();
        }
    } catch (err) {
        console.warn("FastAPI REST backend offline. Running in resilient local offline mode.", err);
    }
}

// ================= FLOATING AI COPILOT SYSTEM =================
function initAiCopilot() {
    // Open Drawer Triggers
    const openDrawer = () => {
        elements.copilotDrawer.classList.add("active");
        elements.copilotOverlay.classList.add("active");
    };

    const closeDrawer = () => {
        elements.copilotDrawer.classList.remove("active");
        elements.copilotOverlay.classList.remove("active");
    };

    elements.copilotNavTrigger.addEventListener("click", openDrawer);
    elements.headerCopilotTrigger.addEventListener("click", openDrawer);
    elements.copilotCloseBtn.addEventListener("click", closeDrawer);
    elements.copilotOverlay.addEventListener("click", closeDrawer);

    // Send chat text handlers
    const sendMsg = () => {
        const text = elements.copilotChatInput.value.trim();
        if (!text) return;

        appendChatMessage("user", text);
        elements.copilotChatInput.value = "";
        
        // Dynamic Response Engine routing
        setTimeout(() => {
            processAiQuery(text);
        }, 500);
    };

    elements.copilotSendBtn.addEventListener("click", sendMsg);
    elements.copilotChatInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMsg();
    });

    // Suggested Questions triggers
    elements.suggestedQBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const question = btn.getAttribute("data-question");
            appendChatMessage("user", question);
            setTimeout(() => {
                processAiQuery(question);
            }, 500);
        });
    });
}

function appendChatMessage(sender, text) {
    const bubble = document.createElement("div");
    bubble.className = `chat-message ${sender}`;

    const icon = sender === "assistant" ? "fa-robot" : "fa-user";
    
    // Parse markdown-like bold parameters into tags
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    bubble.innerHTML = `
        <div class="msg-avatar"><i class="fa-solid ${icon}"></i></div>
        <div class="msg-bubble">${formattedText}</div>
    `;

    elements.copilotChatMessages.appendChild(bubble);
    elements.copilotChatMessages.scrollTop = elements.copilotChatMessages.scrollHeight;
}

async function processAiQuery(query) {
    const q = query.toLowerCase();
    let reply = "";

    // Check if the query refers to a customer ID in our database
    const matchedCustomer = customerDatabase.find(c => q.includes(c.id.toLowerCase()));
    
    if (matchedCustomer) {
        appendChatMessage("assistant", `I am querying the live Meta-Learner models for **${matchedCustomer.name} (${matchedCustomer.id})**...`);
        
        try {
            const response = await fetch("/recommend", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    customer_id: matchedCustomer.id,
                    monthly_charges: parseFloat(matchedCustomer.monthlyCharges.replace(/[^\d.]/g, ""))
                })
            });
            
            if (!response.ok) {
                throw new Error("API Recommend call failed");
            }
            
            const data = await response.json();
            
            reply = `### ML Prescriptive Summary for **${matchedCustomer.name} (${matchedCustomer.id})**:
                    *   **Current Risk Score**: **${(data.churn_probability * 100).toFixed(1)}%**
                    *   **Segment classification**: **${data.segment.toUpperCase()}**
                    *   **Prescriptive Recommendation**: **${data.best_action}**
                    *   **Predicted CATE Lift**: **+${(data.lift * 100).toFixed(1)}% points**
                    *   **Expected Revenue Saved**: **₹${parseInt(data.revenue_saved).toLocaleString('en-IN')}**
                    *   **Action Cost**: ₹${data.cost} (Expected ROI: **${(data.roi * 100).toFixed(0)}%**)
                    
                    **Top Predictive Attributions (SHAP)**:
                    1. ${data.explanation.top_factor_1}
                    2. ${data.explanation.top_factor_2}
                    3. ${data.explanation.top_factor_3}`;
        } catch (err) {
            console.warn("Copilot API recommendation failed, falling back to static offline rules.", err);
            if (matchedCustomer.id === "C-82941") {
                reply = `For **Alexandra Sterling (C-82941)**, the optimal prescriptive intervention is **Annual Discount (15%)**.
                        *   **Estimated CATE Uplift**: +24.5% points.
                        *   **Revenue Saved (Annual)**: ₹12,400.
                        *   **Intervention Cost**: ₹500.
                        *   **Simulated Campaign ROI**: **9,900%**. 
                        Outreach call is also high impact (+18.5% lift, 9,900% ROI). Upgrade is medium (+15.9%). Avoid direct email marketing.`;
            } else if (matchedCustomer.id === "C-90123") {
                reply = `For **Marcus Vance (C-90123)** (Growth Tier, 1.4y tenure):
                        *   **Churn Risk**: 32.1% (Low-Medium).
                        *   **Causal Archetype**: **Sure Thing**.
                        *   **Prescription**: Nurture Email Only. Core product engagement is solid; do not saturate this account with unnecessary discount calls.`;
            } else if (matchedCustomer.id === "C-12984") {
                reply = `Warning: **Nolan Briggs (C-12984)** is in the **Do Not Disturb** cohort.
                        *   **Churn Risk**: 68.4%.
                        *   **Simulated Email Lift**: **-12.8%** (worsens churn!).
                        Outreach triggers opt-out alerts. Recommendation is to **Suppress Marketing** immediately and allow organic product usage to stabilize.`;
            } else {
                reply = `For **${matchedCustomer.name} (${matchedCustomer.id})**, the optimal intervention is **${matchedCustomer.recommendedAction}** with a predicted lift of **${matchedCustomer.lift}**.`;
            }
        }
    } else if (q.includes("power users") || q.includes("power")) {
        reply = `The **Power Users (Tier 1)** segment consists of high-value accounts with tenures exceeding 24 months. 
                *   **Uplift Response**: +12.4% average lift.
                *   **Targeting Priority**: Low (Classified as **Sure Things**).
                *   **Business Impact**: These customers are highly loyal. Wasting campaign discount dollars on them is not recommended since they exhibit 90%+ organic retention metrics anyway.`;
    } else if (q.includes("persuadables") || q.includes("persuadable")) {
        reply = `The **Persuadables** cohort contains customers who stay *only* if targeted with specific actions.
                *   **Segment Size**: 8,941 customers (48.5% of cohort).
                *   **Average CATE Lift**: +18.5% points.
                This is the highest-ROI segment where every dollar spent yields active business value. Recommended to deploy a priority Call or Loyalty Accelerator.`;
    } else {
        reply = `I've analyzed your query regarding **"${query}"**. 
                Based on active X-Learner calculations:
                *   We have **8,941 Persuadables** who should be targeted.
                *   Average predicted uplift across the active portfolio is **+4.2pp**.
                *   Top predictive risk factor for the cohort is **Support Ticket SLA Latency**.
                Let me know if you would like me to compile details on a specific customer ID or export the ROI optimization sheet!`;
    }

    appendChatMessage("assistant", reply);
}

// ================= ENTRY INITIALIZATION =================
document.addEventListener("DOMContentLoaded", () => {
    // 1. Initial Routing & Global Events
    initRouter();
    initGlobalActions();

    // 2. Load Core Data Elements
    renderDecayChart();
    renderCustomerTable();
    initTableControls();

    // 3. Setup Detail Pages & Controls
    initExplainabilityControls();
    initCounterfactualControls();
    
    // 4. Set up Drawer triggers
    initAiCopilot();

    // 5. Connect dynamic FastAPI serving layer
    loadCustomerDataFromServer();
});
