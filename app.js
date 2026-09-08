// LOGIN

function login() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email === "" || password === "") {
        showToast("Please enter email and password");
        return;
    }

    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");

    showToast("Login successful!");
}


// LOGOUT

function logout() {

    document.getElementById("app").classList.add("hidden");
    document.getElementById("loginPage").classList.remove("hidden");

    showToast("Logged out successfully");
}


// PAGE NAVIGATION

function showPage(pageName, clickedButton = null) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(page => {
        page.classList.add("hidden");
    });

    const targetPage = document.getElementById(pageName);
    if (targetPage) {
        targetPage.classList.remove("hidden");
    }

    const titles = {

        dashboard: "Dashboard",
        profile: "Customer Profile",
        documents: "Document Wallet",
        kyc: "KYC Verification",
        services: "Account Services",
        loans: "Loans",
        transactions: "Transactions",
        cards: "Card Controls",
        insights: "Spending Insights",
        assistant: "AI Assistant"

    };

    const pageTitle = document.getElementById("pageTitle");
    if (pageTitle) {
        pageTitle.innerText = titles[pageName] || "Dashboard";
    }

    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    if (clickedButton) {
        clickedButton.classList.add("active");
    }
}


// DOCUMENT UPLOAD

function uploadDocument() {

    const file =
        document.getElementById("documentUpload").files[0];

    if (!file) return;

    const documentList =
        document.getElementById("documentList");

    const item = document.createElement("div");

    item.className = "document";

    item.innerHTML = `
        <div class="document-icon">📄</div>

        <div>
            <b>${file.name}</b>
            <small>AI verification in progress...</small>
        </div>

        <span class="badge pending">
            Processing
        </span>
    `;

    documentList.appendChild(item);

    showToast("Document uploaded. AI verification started.");

    setTimeout(() => {

        item.querySelector("small").innerText =
            "AI verification completed";

        const badge = item.querySelector(".badge");

        badge.innerText = "Verified";
        badge.className = "badge verified";

        showToast("Document verified successfully!");

    }, 2000);
}


// ACCOUNT SERVICES

function serviceMessage(service) {

    showToast(
        service + " request submitted successfully!"
    );

}


// LOAN

function applyLoan() {

    showToast(
        "Loan application submitted successfully!"
    );

}


// DISPUTE

function openDispute() {

    const reason =
        prompt(
            "Enter transaction ID or transaction description:"
        );

    if (reason) {

        showToast(
            "Transaction dispute submitted successfully!"
        );

    }

}


// AI CHAT

function handleChat(event) {

    if (event.key === "Enter") {
        sendMessage();
    }

}


function sendMessage() {

    const input =
        document.getElementById("chatInput");

    const message =
        input.value.trim();

    if (message === "") return;


    const chat =
        document.getElementById("chat");


    const userMessage =
        document.createElement("div");

    userMessage.className =
        "message user";

    userMessage.innerText =
        message;

    chat.appendChild(userMessage);


    input.value = "";


    setTimeout(() => {

        const botMessage =
            document.createElement("div");

        botMessage.className =
            "message bot";


        let response =
            "I can help you with your FinVora account.";

        const text =
            message.toLowerCase();


        if (text.includes("balance")) {

            response =
                "Your available account balance is ₹85,420.";

        }

        else if (text.includes("loan")) {

            response =
                "Your current active loan amount is ₹2,50,000.";

        }

        else if (text.includes("kyc")) {

            response =
                "Your KYC status is Verified.";

        }

        else if (text.includes("transaction")) {

            response =
                "Your latest transaction was Amazon for ₹2,499.";

        }

        else if (text.includes("document")) {

            response =
                "You currently have 5 documents in your Document Wallet.";

        }

        else if (text.includes("hello") ||
                 text.includes("hi")) {

            response =
                "Hello! How can I help you today?";

        }


        botMessage.innerText =
            response;

        chat.appendChild(botMessage);

        chat.scrollTop =
            chat.scrollHeight;

    }, 600);

}


// TOAST

function showToast(message) {

    const toast =
        document.getElementById("toast");

    toast.innerText = message;

    toast.style.display = "block";

    setTimeout(() => {

        toast.style.display = "none";

    }, 2500);

}

// NOTIFICATIONS

function toggleNotifications() {

    document.getElementById("notificationPanel")
        .classList.toggle("hidden");

}

function clearNotifications() {

    document.getElementById("notificationList").innerHTML =
        '<p class="empty-notifications">You are all caught up.</p>';

    document.getElementById("notificationCount").classList.add("hidden");

}

function openNotification(pageName) {

    showPage(pageName);
    document.getElementById("notificationPanel").classList.add("hidden");

}