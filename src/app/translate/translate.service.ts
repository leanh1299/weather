// app/translate/translate.service.ts

import { Injectable, Inject } from '@angular/core';
import { TRANSLATIONS } from './translations'; // import our opaque token

@Injectable()
export class TranslateService {
    private _currentLang: string;

    public get currentLang() {
        return this._currentLang;
    }

    public setCurrentLang(language) {
        this._currentLang = language;
    }

    public getCurrentLang() {
        return this.currentLang;
    }

    // inject our translations
    constructor(@Inject(TRANSLATIONS) private _translations: any) {
    }

    public use(lang: string): void {
        // set current language
        // console.log('setLang='+lang);
        this._currentLang = lang;
    }

    private translate(key: string): string {

        // private perform translation
        let translation = key;
        // if(key=='test'){
        //     console.log('key='+key+ '|this.currentLang='+this.currentLang+"|typeof this._translations="+(typeof this._translations)+"|this._translations[this.currentLang]="+this._translations['LANG_EN_NAME'][key]+this._translations[this.currentLang]);
        //     Object.keys(this._translations).forEach(key => console.log(key));
        // }
        var curr_lang = '';
        if (this.currentLang == 'en') curr_lang = 'LANG_EN_NAME';
        else if (this.currentLang == 'vi') curr_lang = 'LANG_VI_NAME';
        if (this._translations[curr_lang] && this._translations[curr_lang][key]) {
            return this._translations[curr_lang][key];
        }

        return translation;
    }

    public instant(key: string) {
        // call translation
        return this.translate(key);
    }
}
