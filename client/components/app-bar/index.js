class AppBar extends Component {
    constructor() {
        super();
        this.initElement();
    }

    initElement() {
        this.addStyleSheet("/components/app-bar/styles.css");
        this.createHomeButton();
        this.createTitle();
        this.createProfileCard();
        this.createAdminButton();
    }

    createProfileCard() {
        this.userProfile = document.createElement("div");
        this.profileImage = document.createElement("img");
        this.userProfile.appendChild(this.profileImage);
        this.container.appendChild(this.userProfile);

        this.profileCard = new Card();
        this.profileCard.setVisible(false);

        this.profileCard.container.classList.add("profileCard")

        console.log(this.profileCard)
        
        //this.profileCard.shadowRoot.classList.add("profile", "hideProfileCard");
        this.container.appendChild(this.profileCard);
        this.profileCardVisible = false;
        this.userProfile.onclick = evt => {
            if(this.profileCardVisible) {
                //this.profileCard.shadowRoot.classList.add("hideProfileCard");
                this.profileCard.setVisible(false);
                this.profileCardVisible = false;
            } else {
                //this.profileCard.shadowRoot.classList.remove("hideProfileCard");
                this.profileCard.setVisible(true);
                this.profileCardVisible = true;
            }
        }
        this.displayName = document.createElement("h4");
        this.email = document.createElement("h5");
        this.profileCard.createTitle(this.displayName);
        this.profileCard.createContent(this.email);
        this.logOutButton = document.createElement("button");
        this.logOutButton.append("Sign Out");
        this.logOutButton.onclick = evt => logout();
        this.profileCard.appendChild(this.logOutButton);
    }
    createTitle() {
        this.container.append("Questionnaire App");
        this.container.classList.add("appBar");
    }

    createHomeButton() {
        this.btn = document.createElement("button");
        this.btn.classList.add("homeBtn");
        this.btn.classList.add("btn");
        this.container.appendChild(this.btn);
    }
    createAdminButton() {
        this.adminbtn = document.createElement("button");
        this.adminbtn.classList.add("adminBtn");
        this.adminbtn.classList.add("btn");
        this.container.appendChild(this.adminbtn);
    }

    setUser(newValue) {
        console.log(newValue)
        this.displayName.append(newValue.displayName);
        this.email.append(newValue.email);
    }
    clearUser() {
        this.displayName.innerHTML="";
        this.email.innerHTML="";
        this.logOutButton.innerHTML="Sign In";
        //this.logOutButton.removeEventListener()
    }
}

customElements.define('app-bar', AppBar);