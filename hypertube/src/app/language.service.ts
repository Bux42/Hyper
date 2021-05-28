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

        this.translated["Leave a comment"] = {};
        this.translated["Leave a comment"]["en"] = "Leave a comment";
        this.translated["Leave a comment"]["fr"] = "Laisser un commentaire";

        this.translated["Quality"] = {};
        this.translated["Quality"]["en"] = "Quality";
        this.translated["Quality"]["fr"] = "Résolution";

        this.translated["Size"] = {};
        this.translated["Size"]["en"] = "Size";
        this.translated["Size"]["fr"] = "Taille";
        
        this.translated["Post comment"] = {};
        this.translated["Post comment"]["en"] = "Post comment";
        this.translated["Post comment"]["fr"] = "Publier commentaire";

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
        
        this.translated["Edit profile"] = {};
        this.translated["Edit profile"]["en"] = "Edit profile";
        this.translated["Edit profile"]["fr"] = "Modifier profil";

        this.translated["Save"] = {};
        this.translated["Save"]["en"] = "Save";
        this.translated["Save"]["fr"] = "Enregistrer";

        this.translated["Update email"] = {};
        this.translated["Update email"]["en"] = "Update email";
        this.translated["Update email"]["fr"] = "Changer email";
        
        this.translated["Update password"] = {};
        this.translated["Update password"]["en"] = "Update password";
        this.translated["Update password"]["fr"] = "Changer mot de passe";

        this.translated["Profile updated"] = {};
        this.translated["Profile updated"]["en"] = "Profile updated";
        this.translated["Profile updated"]["fr"] = "Profil modifié";

        this.translated["Email updated"] = {};
        this.translated["Email updated"]["en"] = "Email updated";
        this.translated["Email updated"]["fr"] = "Email modifié";
        
        this.translated["Password updated"] = {};
        this.translated["Password updated"]["en"] = "Password updated";
        this.translated["Password updated"]["fr"] = "Mot de passe modifié";

        this.translated["Hello"] = {};
        this.translated["Hello"]["en"] = "Hello";
        this.translated["Hello"]["fr"] = "Bonjour";

        this.translated["Email"] = {};
        this.translated["Email"]["en"] = "Email";
        this.translated["Email"]["fr"] = "Email";

        this.translated["Password"] = {};
        this.translated["Password"]["en"] = "Password";
        this.translated["Password"]["fr"] = "Mot de passe";

        this.translated["New password"] = {};
        this.translated["New password"]["en"] = "New password";
        this.translated["New password"]["fr"] = "Nouveau mot de passe";
        
        this.translated["New email"] = {};
        this.translated["New email"]["en"] = "New email";
        this.translated["New email"]["fr"] = "Nouvel email";

        this.translated["Confirm new password"] = {};
        this.translated["Confirm new password"]["en"] = "Confirm new password";
        this.translated["Confirm new password"]["fr"] = "Confirmer mot de passe";

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

        this.translated["History"] = {};
        this.translated["History"]["en"] = "History";
        this.translated["History"]["fr"] = "Votre historique";

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

        this.translated["comments"] = {};
        this.translated["comments"]["en"] = "comments";
        this.translated["comments"]["fr"] = "commentaires";
        
        this.translated["Season"] = {};
        this.translated["Season"]["en"] = "Season";
        this.translated["Season"]["fr"] = "Saison";

        this.translated["Episode"] = {};
        this.translated["Episode"]["en"] = "Episode";
        this.translated["Episode"]["fr"] = "Episode";
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
