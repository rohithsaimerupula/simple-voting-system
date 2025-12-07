import { 
    auth, 
    db 
} from "./firebase-config.js";

import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    setDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";


// -----------------------------------------
// VOTER REGISTRATION
// -----------------------------------------
async function registerVoter() {
    const name = document.getElementById("regName").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    try {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCred.user;

        await setDoc(doc(db, "voters", user.uid), {
            name,
            email,
            approved: false
        });

        alert("Registration successful! Wait for admin approval.");
    } catch (error) {
        alert("Error: " + error.message);
    }
}
window.registerVoter = registerVoter;


// -----------------------------------------
// VOTER LOGIN
// -----------------------------------------
async function voterLogin() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const user = userCred.user;

        const voterRef = await getDoc(doc(db, "voters", user.uid));

        if (!voterRef.exists()) {
            alert("Not registered as voter!");
            return;
        }

        if (!voterRef.data().approved) {
            alert("Admin has not approved your account yet!");
            return;
        }

        window.location.href = "vote.html";

    } catch (err) {
        alert("Login error: " + err.message);
    }
}
window.voterLogin = voterLogin;


// -----------------------------------------
// ADMIN LOGIN
// -----------------------------------------
function adminLogin() {
    const username = document.getElementById("adminUser").value;
    const password = document.getElementById("adminPass").value;

    if (username === "Merupula Rohith Sai" && password === "mouli0511") {
        window.location.href = "admin-dashboard.html";
    } else {
        alert("Invalid admin credentials!");
    }
}
window.adminLogin = adminLogin;


// -----------------------------------------
// LOAD PENDING APPROVALS
// -----------------------------------------
async function loadApprovals() {
    const container = document.getElementById("approvalList");

    const votersRef = await getDocs(collection(db, "voters"));
    const participantsRef = await getDocs(collection(db, "participants"));

    container.innerHTML = "";

    votersRef.forEach(docSnap => {
        const data = docSnap.data();
        if (!data.approved) {
            container.innerHTML += `
                <div class="card">
                    <p><b>Voter:</b> ${data.name}</p>
                    <p>${data.email}</p>
                    <button onclick="approveUser('${docSnap.id}', 'voters')">Approve</button>
                </div>
            `;
        }
    });

    participantsRef.forEach(docSnap => {
        const data = docSnap.data();
        if (!data.approved) {
            container.innerHTML += `
                <div class="card">
                    <p><b>Participant:</b> ${data.name}</p>
                    <p>Symbol: ${data.symbol}</p>
                    <button onclick="approveUser('${docSnap.id}', 'participants')">Approve</button>
                </div>
            `;
        }
    });
}
window.loadApprovals = loadApprovals;


// -----------------------------------------
// APPROVE USERS
// -----------------------------------------
async function approveUser(id, type) {
    await updateDoc(doc(db, type, id), { approved: true });
    alert("Approved!");
    loadApprovals();
}
window.approveUser = approveUser;


// -----------------------------------------
// CAST VOTE
// -----------------------------------------
async function castVote(participantId) {
    const user = auth.currentUser;
    if (!user) return alert("Login first!");

    const voteRef = doc(db, "votes", user.uid);
    const existingVote = await getDoc(voteRef);

    if (existingVote.exists()) {
        alert("You already voted!");
        return;
    }

    await setDoc(voteRef, { participantId });

    alert("Vote submitted!");
}
window.castVote = castVote;


// -----------------------------------------
// LOAD PARTICIPANTS ON VOTE PAGE
// -----------------------------------------
async function loadParticipants() {
    const container = document.getElementById("participantsList");

    const snap = await getDocs(collection(db, "participants"));

    snap.forEach(docSnap => {
        const p = docSnap.data();
        if (p.approved) {
            container.innerHTML += `
                <div class="card">
                    <h3>${p.name}</h3>
                    <p>Symbol: ${p.symbol}</p>
                    <button onclick="castVote('${docSnap.id}')">Vote</button>
                </div>
            `;
        }
    });
}
window.loadParticipants = loadParticipants;


// -----------------------------------------
// RESULTS
// -----------------------------------------
async function loadResults() {
    const voteSnap = await getDocs(collection(db, "votes"));
    const participantsSnap = await getDocs(collection(db, "participants"));

    const voteCount = {};

    participantsSnap.forEach(docSnap => {
        voteCount[docSnap.id] = { name: docSnap.data().name, votes: 0 };
    });

    voteSnap.forEach(docSnap => {
        const pid = docSnap.data().participantId;
        voteCount[pid].votes++;
    });

    // GRAPH DRAWING
    drawCharts(voteCount);
}
window.loadResults = loadResults;


// -----------------------------------------
// DRAW RESULT GRAPHS
// -----------------------------------------
function drawCharts(data) {
    const labels = Object.values(data).map(v => v.name);
    const votes = Object.values(data).map(v => v.votes);

    new Chart(document.getElementById("pieChart"), {
        type: "pie",
        data: { labels, datasets: [{ data: votes }] }
    });

    new Chart(document.getElementById("barChart"), {
        type: "bar",
        data: { labels, datasets: [{ data: votes }] }
    });
}
async function registerParticipant() {
    const name = document.getElementById("pName").value;
    const email = document.getElementById("pEmail").value;
    const symbol = document.getElementById("pSymbol").value;

    try {
        await addDoc(collection(db, "participants"), {
            name, email, symbol,
            approved: false
        });

        alert("Participant Registered! Wait for Admin Approval.");
    } catch (err) {
        alert("Error: " + err.message);
    }
}
window.registerParticipant = registerParticipant;
