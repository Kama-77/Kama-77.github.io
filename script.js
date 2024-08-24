// Fonction pour vérifier le code
function verifierCode() {
    var code = document.getElementById("codeInput").value;
    if (code === "42") { 
        // Comportement existant pour le code "42"
        document.querySelector("h1").style.display = "none"; 
        document.getElementById("codeInput").style.display = "none"; 
        document.querySelector("button[onclick='verifierCode()']").style.display = "none"; 
        document.querySelectorAll(".hidden-text").forEach(function(element) {
            element.style.display = "none"; 
        });

        document.getElementById("devinettes").style.display = "block";
        afficherQuestionOuDilemme();
    } else if (code === "Cherche dans les détails pour voir ce qui est invisible") {
        // Nouveau comportement pour la réponse "Cherche dans les détails pour voir ce qui est invisible"
        document.querySelector("h1").style.display = "none"; 
        document.getElementById("codeInput").style.display = "none"; 
        document.querySelector("button[onclick='verifierCode()']").style.display = "none"; 
        
        // Masquer les messages cachés
        document.querySelectorAll(".hidden-text").forEach(function(element) {
            element.style.display = "none"; 
        });

        // Afficher le message de félicitations
        var bravoMessage = document.createElement("div");
        bravoMessage.style.position = "relative";  // Position relative pour pouvoir décaler
        bravoMessage.style.left = "-20%";          // Décale vers la gauche
        bravoMessage.style.margin = "20px auto";   // Centre verticalement et horizontalement
        bravoMessage.style.width = "60%";          // Largeur du conteneur
        bravoMessage.innerHTML = `
            <p style="font-size: 1.5em;">Bravo, tu as battu mon jeu ! Tu as montré une grande persévérance et un esprit acéré pour déchiffrer tous les indices et surmonter chaque défi. Mais n'oublie pas : ce n'est peut-être que le début de l'aventure. Continue à chercher des mystères et des énigmes à résoudre, car l'esprit est le plus grand des trésors. Tu as réussi cette fois, mais est-ce vraiment la fin ? Prépare-toi, car un nouveau défi pourrait bientôt voir le jour. Reste attentif, car les mystères n'attendent jamais longtemps pour être découverts et aussi rappelle-toi toujours de ça... La vie est pleine de mystères à déchiffrer, tout comme ce jeu. Continue à chercher, à apprendre, et à explorer. Chaque réponse n'est que le début d'une nouvelle question. À bientôt, on se voit à la prochaine aventure ! Peut-être... – Kama</p>
            <p style="font-size: 0.7em; color: black; text-align: right; margin-top: 20px;">Hehe tu m'a trouver ? Si tu veut me contacter vien la : "https://discord.gg/HM9vNYFRFM" En tout cas je suis content que tu n'est pas oublier "Le trésor est là où personne ne regarde."</p>
        `;
        document.body.appendChild(bravoMessage);
    } else {
        // Comportement existant pour toute autre réponse incorrecte
        document.getElementById("messageFaux").style.display = "block";
    }
}

// Initialisation des variables pour suivre les étapes
var startTime = Date.now();
var questionIndex = 0;
var dilemmaIndex = 0;

// Liste des questions et réponses pour les devinettes creepy
var questions = [
    { question: "Dans quel pays vis-tu ? (English Country Name)", reponse: obtenirPaysUtilisateur() },
    { question: "Quel navigateur utilises-tu en ce moment ?", reponse: obtenirNavigateur() },
    { question: "Combien de minutes as-tu passées sur ce site ?", reponse: obtenirTempsPasse() },
    { question: "Quelle heure est-il chez toi en ce moment ? (Write like this : XXHXX)", reponse: obtenirHeureLocale() },
    { question: "Quel est ton nom ?", reponse: "Je le connais déjà" }
];

// Liste des dilemmes et remarques
var dilemmas = [
    { question: "Tu es devant un levier. Si tu le tires, le train déraillera et tueras une personne attachée sur une voie. Si tu ne fais rien, il tuera cinq personnes. Que fais-tu ?", options: ["Je tire le levier.", "Je ne fais rien."], remarque: ["Vraiment ? Tu as réellement choisi de commettre un meurtre ? Je ne savais pas que tu étais une si horrible personne...", "Vraiment ? Tu as réellement choisi laisser mourir cinq personnes sous tes yeux sans rien faire? Je ne savais pas que tu étais une si horrible personne..."] },
    { question: "Tu peux arrêter une catastrophe en sacrifiant une personne innocente. Ou tu peux la laisser vivre et condamner des milliers de personne a une mort certaine. Que choisis-tu ?", options: ["Je sacrifie la personne.", "Je la laisse vivre."], remarque: ["C'est surprenant de voir à quel point tu peux être insensible... Tuer une innocente que tu ne connais pas de sang froid... C'est inhumain", "C'est surprenant de voir à quel point tu peux être égoiste... Tu préfères ne pas te salir les mains même si c'est pour sauver des milliers de personnes"] },
    { question: "Un ami proche a commis un crime hodieux, mais personne ne le sait. Tu peux le dénoncer et détruire sa vie, ou tu peux garder le secret. Que fais-tu ?", options: ["Je le dénonce.", "Je garde le secret."], remarque: ["Je me demande si tu ferais la même chose dans la vraie vie... Aurais-tu eu le cran de voir ton ami au fond du gouffre? Aurais-tu pu regarder sa famille dans les yeux lorsque tu apprendras qu'il s'est pendu à cause de toi?", "Je me demande si tu ferais la même chose dans la vraie vie... Aurais-tu eu le cran de voir ton ami dans les yeux après avoir su ce qu'il a fait ? Aurais-tu pu garder ce secret, sans être rongé de remords? Même devant la famille de la victime ?"] },
    { question: "Deux personnes sont en danger, mais tu ne peux en sauver qu'une. Une est un inconnu et l'autre est quelqu'un que tu connais bien. Qui sauves-tu ?", options: ["Je sauve l'inconnu.", "Je sauve la personne que je connais."], remarque: ["Ce choix en dit long sur ta moralité... Comment peux-tu sauver une inconnue en regardant ton ami mourir devant toi?", "Ce choix en dit long sur ta moralité... Comment peux-tu sauver ton ami en regardant l'inconnue mourir à cause de ton égoïsme ?"] },
    { question: "Tu as l'opportunité de te sacrifier pour sauver beaucoup d'autres personnes, mais cela signifie ta mort certaine. Acceptes-tu ?", options: ["Oui, je me sacrifie.", "Non, je choisis de vivre."], remarque: ["Tout ça pour avoir bonne conscience hein? Je me demande si tu aurais fait pareil dans la vraie vie...", " Comment peux-tu prétendre vivre après avoir toutes ces morts sur la conscience ?"] }
];

// Fonction pour afficher la question ou le dilemme
function afficherQuestionOuDilemme() {
    if (questionIndex < questions.length) {
        var questionElement = document.getElementById("question");
        questionElement.textContent = questions[questionIndex].question;

        // Gestion spécifique pour la question sur le nom
        if (questions[questionIndex].question === "Quel est ton nom ?") {
            var reponseInput = document.getElementById("reponseInput");
            reponseInput.addEventListener('input', remplacerTexte);
        } else {
            // Réinitialise la zone de réponse pour d'autres questions
            var reponseInput = document.getElementById("reponseInput");
            reponseInput.value = "";
            reponseInput.placeholder = "Entrez votre réponse";
            reponseInput.readOnly = false;
            reponseInput.classList.remove("creepy-input");
        }

        document.getElementById("reponseInput").style.display = "inline";
        document.getElementById("options").style.display = "none";
    } else {
        // Après les devinettes, affiche les dilemmes
        afficherDilemme(dilemmaIndex);
    }
}

// Fonction pour remplacer la zone de texte par un texte fixe et creepy
function remplacerTexte() {
    var reponseInput = document.getElementById("reponseInput");

    reponseInput.value = "Je le connais déjà";
    reponseInput.readOnly = true; // Rendre la zone de texte non modifiable
    reponseInput.classList.add("creepy-input"); // Ajouter la classe pour la police creepy et le texte rouge
}

// Fonction pour vérifier la réponse de l'utilisateur pour les devinettes
function verifierReponse() {
    var reponse = document.getElementById("reponseInput").value;
    // Vérifie si la réponse est correcte ou si la zone de texte est en mode "Je le connais déjà"
    if (questionIndex < questions.length && (verifierReponseQuestion(reponse) || reponse === "Je le connais déjà")) {
        questionIndex++;
        afficherQuestionOuDilemme();
    } else {
        alert("Tu essaie de me mentir ? Très bien, cela ne sert a rien de continuer alors... La page vas se fermer !");
        window.close();
    }
}

// Fonction pour vérifier la réponse des questions (en particulier pour l'heure)
function verifierReponseQuestion(reponse) {
    if (questionIndex === 3) { // Question sur l'heure
        var now = new Date();
        var heure24 = now.getHours().toString().padStart(2, '0') + "H" + now.getMinutes().toString().padStart(2, '0');
        var heure12 = (now.getHours() % 12 || 12).toString().padStart(2, '0') + "H" + now.getMinutes().toString().padStart(2, '0');
        return reponse === heure24 || reponse === heure12;
    }
    return reponse === questions[questionIndex].reponse;
}

// Fonction pour afficher un dilemme
function afficherDilemme(index) {
    var questionElement = document.getElementById("question");
    questionElement.textContent = dilemmas[index].question;
    document.getElementById("reponseInput").style.display = "none";
    document.getElementById("verifierButton").style.display = "none"; // Cache le bouton de vérification des réponses
    var optionsHtml = dilemmas[index].options.map(function(option, i) {
        return '<button class="creepy-button" onclick="choisirOption(' + i + ')">' + option + '</button>';
    }).join(" ");
    document.getElementById("options").innerHTML = optionsHtml;
    document.getElementById("options").style.display = "block";
}

// Fonction pour gérer le choix de l'utilisateur dans un dilemme
function choisirOption(index) {
    var gunshotSound = document.getElementById("gunshotSound");
    gunshotSound.play(); // Joue le son du pistolet
    var remarque = dilemmas[dilemmaIndex].remarque[index];
    alert(remarque);
    dilemmaIndex++;
    if (dilemmaIndex < dilemmas.length) {
        afficherDilemme(dilemmaIndex);
    } else {
        // Supprimer les dilemmes
        document.getElementById("devinettes").style.display = "none"; // Cache le conteneur des devinettes et dilemmes
        document.getElementById("question").style.display = "none"; // Cache la question
        document.getElementById("options").style.display = "none"; // Cache les options
        // Afficher le message final
        document.getElementById("messageFinal").style.display = "block"; // Affiche le message final
    }
}

// Fonction pour afficher la question finale "Who killed Zee?"
function afficherQuestionFinale() {
    document.getElementById("messageFinal").style.display = "none";
    document.getElementById("questionFinale").style.display = "block";
}

// Fonction pour vérifier la réponse à la question finale "Who killed Zee?"
function verifierQuestionFinale() {
    var reponse = document.getElementById("zeeAnswer").value;
    if (reponse.trim().toLowerCase() === "kama__7") {
        document.getElementById("questionFinale").style.display = "none";
        document.getElementById("puzzle").style.display = "block";
        creerPuzzle(); // Affiche le puzzle lorsque la réponse est correcte
    } else {
        alert("Mauvaise réponse, la réponse est dans une vidéo que tu as déjà vue, mais si tu veux je peux te donner une autre vidéo où la réponse est plus explicite : '_VysI_sur5A' YT");
    }
}

// Fonction pour créer et afficher un puzzle simple
function creerPuzzle() {
    var puzzleContainer = document.getElementById("puzzleContainer");
    puzzleContainer.innerHTML = ""; // Réinitialise le puzzle à chaque appel

    var pieces = [
        { text: "Zee", correctPosition: 1 },
        { text: "was", correctPosition: 2 },
        { text: "slain", correctPosition: 3 },
        { text: "by", correctPosition: 4 },
        { text: "Kama__7", correctPosition: 5 }
    ];

    // Mélange les pièces de manière aléatoire
    pieces = pieces.sort(() => Math.random() - 0.5);

    // Affiche les pièces dans le conteneur
    pieces.forEach(function(piece) {
        var pieceElement = document.createElement("div");
        pieceElement.textContent = piece.text;
        pieceElement.classList.add("puzzle-piece");
        pieceElement.draggable = true;

        // Événements pour le drag-and-drop
        pieceElement.addEventListener("dragstart", function(e) {
            e.dataTransfer.setData("text", e.target.textContent);
        });

        pieceElement.addEventListener("dragover", function(e) {
            e.preventDefault();
        });

        pieceElement.addEventListener("drop", function(e) {
            e.preventDefault();
            var data = e.dataTransfer.getData("text");
            var draggedElement = Array.from(puzzleContainer.children).find(function(el) {
                return el.textContent === data;
            });

            // Échange les contenus des éléments
            var temp = e.target.textContent;
            e.target.textContent = draggedElement.textContent;
            draggedElement.textContent = temp;
        });

        puzzleContainer.appendChild(pieceElement);
    });
}

// Fonction pour vérifier si le puzzle est correct
function verifierPuzzle() {
    var pieces = Array.from(document.querySelectorAll(".puzzle-piece"));
    var correctOrder = ["Zee", "was", "slain", "by", "Kama__7"];
    var currentOrder = pieces.map(piece => piece.textContent);

    if (JSON.stringify(currentOrder) === JSON.stringify(correctOrder)) {
        accederPlaylist();
    } else {
        alert("Ce n'est pas correct !");
    }
}

// Fonctions pour obtenir les réponses des devinettes
function obtenirPaysUtilisateur() {
    // Placeholder pour exemple, utiliser API pour production
    return "France"; 
}

function obtenirNavigateur() {
    var userAgent = navigator.userAgent;
    if (userAgent.indexOf("Firefox") > -1) {
        return "Firefox";
    } else if (userAgent.indexOf("Chrome") > -1) {
        return "Chrome";
    } else if (userAgent.indexOf("Safari") > -1) {
        return "Safari";
    } else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident/") > -1) {
        return "Internet Explorer";
    }
    return "Autre";
}

function obtenirTempsPasse() {
    var minutes = Math.floor((Date.now() - startTime) / 60000);
    return minutes.toString();
}

// Fonction pour obtenir l'heure locale et formater
function obtenirHeureLocale() {
    var now = new Date();
    var heure24 = now.getHours().toString().padStart(2, '0') + "H" + now.getMinutes().toString().padStart(2, '0');
    return heure24; // Pour faciliter la vérification dans la question sur l'heure
}

// Fonction pour afficher la vidéo Rickroll intégrée et activer le son
function afficherVideoRickRoll() {
    document.getElementById("messageFaux").style.display = "none";
    var videoContainer = document.getElementById("rickRollVideo");
    var video = document.getElementById("rickRoll");
    videoContainer.style.display = "block";
    video.play(); // Lance la vidéo avec le son activé
    video.muted = false; // Assure que le son est activé
    video.controls = false; // Supprime les contrôles de la vidéo pour une meilleure immersion
}

// Fonction pour accéder à la playlist après avoir réussi le puzzle
function accederPlaylist() {
    document.getElementById("puzzle").style.display = "none";
    document.getElementById("playlist").style.display = "block";
}
