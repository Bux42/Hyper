import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    language: any = "en";
    langCodeToLanguage: any = {}
    languageToLangCode: any = {};
    translated: any = {}
    constructor() {
        this.langCodeToLanguage["fr"] = "Français";
        this.langCodeToLanguage["en"] = "English";

        this.languageToLangCode["Français"] = "fr";
        this.languageToLangCode["English"] = "en";

        this.translated["Movies"] = {};
        this.translated["Movies"]["en"] = "Movies";
        this.translated["Movies"]["fr"] = "Films";

        this.translated["Series"] = {};
        this.translated["Series"]["en"] = "Series";
        this.translated["Series"]["fr"] = "Series";

        this.translated["Animes"] = {};
        this.translated["Animes"]["en"] = "Animes";
        this.translated["Animes"]["fr"] = "Animes";

        this.translated["Genre"] = {};
        this.translated["Genre"]["en"] = "Genre";
        this.translated["Genre"]["fr"] = "Genre";

        this.translated["Sort by"] = {};
        this.translated["Sort by"]["en"] = "Sort by";
        this.translated["Sort by"]["fr"] = "Trier par";

        this.translated["Search"] = {};
        this.translated["Search"]["en"] = "Search";
        this.translated["Search"]["fr"] = "Rechercher";

        this.translated["Your profile"] = {};
        this.translated["Your profile"]["en"] = "Your profile";
        this.translated["Your profile"]["fr"] = "Votre profil";

        this.translated["Hello"] = {};
        this.translated["Hello"]["en"] = "Hello";
        this.translated["Hello"]["fr"] = "Bonjour";

        this.translated["Email"] = {};
        this.translated["Email"]["en"] = "Email";
        this.translated["Email"]["fr"] = "Email";

        this.translated["Username"] = {};
        this.translated["Username"]["en"] = "Username";
        this.translated["Username"]["fr"] = "Nom d'utilisateur";

        this.translated["Last Name"] = {};
        this.translated["Last Name"]["en"] = "Last Name";
        this.translated["Last Name"]["fr"] = "Nom de famille";
        
        this.translated["First Name"] = {};
        this.translated["First Name"]["en"] = "First Name";
        this.translated["First Name"]["fr"] = "Prénom";

        this.translated["Prefered Language"] = {};
        this.translated["Prefered Language"]["en"] = "Prefered Language";
        this.translated["Prefered Language"]["fr"] = "Language";

        this.translated["You did see"] = {};
        this.translated["You did see"]["en"] = "You did see";
        this.translated["You did see"]["fr"] = "Votre historique";

        this.translated["Logout"] = {};
        this.translated["Logout"]["en"] = "Logout";
        this.translated["Logout"]["fr"] = "Se déconnecter";

        this.translated["Subtitles"] = {};
        this.translated["Subtitles"]["en"] = "Subtitles";
        this.translated["Subtitles"]["fr"] = "Sous titres";

        this.translated["Sign in with Google"] = {};
        this.translated["Sign in with Google"]["en"] = "Sign in with Google";
        this.translated["Sign in with Google"]["fr"] = "Se connecter avec Google";

        this.translated["You need a username to continue"] = {};
        this.translated["You need a username to continue"]["en"] = "You need a username to continue";
        this.translated["You need a username to continue"]["fr"] = "Veuillez spécifier un nom d'utilisateur";

        this.translated["Confirm"] = {};
        this.translated["Confirm"]["en"] = "Confirm";
        this.translated["Confirm"]["fr"] = "Confirmer";
    }
    getTranslation(word: string) {
        return (this.translated[word][this.language]);
    }
    getLanguageToLangCode(language: string) {
        if (!language) {
            return ("en");
        } else {
            return (this.languageToLangCode[language]);
        }
    }
    getLangCodeToLanguage(langCode: string) {
        if (!langCode) {
            return ("English");
        } else {
            return (this.langCodeToLanguage[langCode]);
        }
    }
    setLanguage(language: string) {
        this.language = language;
    }
}
