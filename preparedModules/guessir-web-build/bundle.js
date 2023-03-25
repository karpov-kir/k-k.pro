(()=>{"use strict";var e;!function(e){e.Word="w",e.SpecialCharacter="sc",e.Letter="l",e.WordHelping="wh"}(e||(e={}));var t=function(){function t(){}return t.syncCase=function(e,t){return t[0]!==e[0]&&t[0].toUpperCase()===e[0]&&(t=t[0].toUpperCase()+t.substring(1)),t},t.convertNormalizedPrimitiveLexeme=function(e,n){var r=t.NORMALIZED_WORDS_TO_NORMALIZED_WORDS.get(n)||n;return this.syncCase(e,r)},t.normalizeCharacter=function(e){var n=e.toLowerCase();return t.CHARACTERS_TO_NORMALIZED_CHARACTERS.get(n)||n},t.uncontractPrimitiveLexeme=function(e){var n=t.NORMALIZED_CONTRACTION_TO_NORMALIZED_NORMAL.get(e.toLowerCase());return n?this.syncCase(e,n):e},t.isWordCharacter=function(e){if(1!==e.length)throw new Error("Can be used only for characters");return t.isLetter(e)||t.isWordHelpingCharacter(e)},t.isLetter=function(e){return t.LETTER_RE.test(e)},t.isWordHelpingCharacter=function(e){return t.NORMALIZED_CONTRACTION_CHARACTERS.includes(e)||t.NORMALIZED_WORD_SEPARATION_CHARACTERS.includes(e)},t.getLexemeType=function(n){return 1===n.normalized.length?t.isWordHelpingCharacter(n.normalized)?e.WordHelping:t.isLetter(n.normalized)?e.Letter:e.SpecialCharacter:e.Word},t.getGroupingWords=function(e){var t=e.length,n=e.toLowerCase();return["s","d"].includes(n[t-1])&&"'"===n[t-2]?[n.slice(0,-2),n]:[n]},t.isLexemeOtherCharacter=function(t){return t.type===e.SpecialCharacter||t.type===e.WordHelping},t.CHARACTERS_TO_NORMALIZED_CHARACTERS=new Map([["—","-"],["’","'"],["`","'"]]),t.NORMALIZED_WORDS_TO_NORMALIZED_WORDS=new Map([["i","I"]]),t.NORMALIZED_CONTRACTION_CHARACTERS=["'"],t.NORMALIZED_WORD_SEPARATION_CHARACTERS=["-"],t.LETTER_RE=/^[A-Za-z]$/,t.NORMALIZED_CONTRACTION_TO_NORMALIZED_NORMAL=new Map([["don't","do not"],["doesn't","does not"],["didn't","did not"],["haven't","have not"],["hadn't","had not"],["shouldn't","should"],["wouldn't","would not"],["couldn't","could not"],["mustn't","must not"],["can't","cannot"],["needn't","need not"],["won't","will not"],["I'm","I am"],["I've","I have"],["I'll","I will"],["she'll","she will"],["he'll","he will"],["we're","we are"],["we've","we have"],["we'll","we will"],["they're","they are"],["they've","they have"],["they'll","they will"]]),t}(),n=function(){return n=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var i in t=arguments[n])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e},n.apply(this,arguments)},r=function(){function r(){this.lexemes=new Map,this.lexemesByWordLike=new Map,this.wordLikeCount=0,this.otherCharacterCount=0,this.lastLexemeIndex=-1}return r.prototype.analyze=function(e){for(var n=e.trim(),r="",i="",o=void 0,s=0,l=n.length;s<l;s++){var a=!1,c=n[s],h=t.normalizeCharacter(c);if(void 0===o&&(o=s),t.isWordCharacter(h)){var u=void 0===n[s+1]?void 0:t.normalizeCharacter(n[s+1]),d=void 0===u||!t.isWordCharacter(u);r+=c,i+=h,a=d,d&&(i=t.convertNormalizedPrimitiveLexeme(r,i))}else r=c,i=h,a=!0;a&&(this.processPrimitiveLexeme(r,i,o,s),o=void 0,r="",i="")}var p=this.lexemes,m=this.lexemesByWordLike,f=this.wordLikeCount,w=this.otherCharacterCount;return this.lexemes=new Map,this.lexemesByWordLike=new Map,this.wordLikeCount=0,this.otherCharacterCount=0,this.lastLexemeIndex=-1,{lexemes:p,lexemesByWordLike:m,wordLikeCount:f,otherCharacterCount:w}},r.prototype.processPrimitiveLexeme=function(e,i,o,s,l){var a=this;void 0===l&&(l={});var c=l.onCreated,h={endIndex:s,startIndex:o,original:e,normalized:i,uncontracted:t.uncontractPrimitiveLexeme(i)},u=n(n({},h),{type:t.getLexemeType(h)});if(u.uncontracted===u.normalized){var d=this.isLastLexemesMatch(1,(function(e){return" "===e.normalized})),p=r.PUNCTUATION_CHARACTERS.includes(u.normalized),m="\n"===u.normalized;if((d&&p||d&&m)&&this.deleteLastLexemes((function(e){return" "===e.normalized})),this.canAddLexeme(u)){var f=++this.lastLexemeIndex;this.lexemes.set(f,u),t.isLexemeOtherCharacter(u)?this.otherCharacterCount++:(this.wordLikeCount++,t.getGroupingWords(u.normalized).forEach((function(e){var t=a.lexemesByWordLike.get(e)||new Map;t.set(f,u),a.lexemesByWordLike.set(e,t)}))),c&&c(u)}}else this.splitUncontractedLexeme(u,o,s)},r.prototype.splitUncontractedLexeme=function(e,n,r){var i=this,o=e.uncontracted.split(" "),s=function(t){return t.uncontracted=e.uncontracted};o.forEach((function(l,a){i.processPrimitiveLexeme(e.original,t.convertNormalizedPrimitiveLexeme(e.original,l),n,r,{onCreated:s}),a<o.length-1&&i.processPrimitiveLexeme(" "," ",n,r,{onCreated:s})}))},r.prototype.canAddLexeme=function(t){return this.lexemes.get(this.lastLexemeIndex)?!("\n"===t.normalized&&this.isLastLexemesMatch(2,(function(e){return"\n"===e.normalized}))||" "===t.normalized&&this.isLastLexemesMatch(1,(function(e){return" "===e.normalized}))):t.type===e.Word||t.type===e.Letter},r.prototype.isLastLexemesMatch=function(e,t){for(var n=this.lastLexemeIndex;e>0;){var r=this.lexemes.get(n);if(!r||!t(r))return!1;n--,e--}return!0},r.prototype.deleteLastLexemes=function(e){for(var n=this,r=this.lexemes.get(this.lastLexemeIndex);r&&e(r);)t.isLexemeOtherCharacter(r)?this.otherCharacterCount--:(this.wordLikeCount--,t.getGroupingWords(r.normalized).forEach((function(e){var t=n.lexemesByWordLike.get(e)||new Map;t.delete(n.lastLexemeIndex),t.size||n.lexemesByWordLike.delete(e)}))),this.lexemes.delete(this.lastLexemeIndex),this.lastLexemeIndex--,r=this.lexemes.get(this.lastLexemeIndex);return!0},r.PUNCTUATION_CHARACTERS=[",",".","!","?",";"],r}(),i=function(){function e(){var e=this;this.subscribers=new Set,this.event={subscribe:function(t){return e.subscribe(t)},unsubscribe:function(t){return e.unsubscribe(t)}}}return e.prototype.publish=function(e){this.subscribers.forEach((function(t){return t(e)}))},e.prototype.subscribe=function(e){if(this.subscribers.has(e))throw new Error("Provided subscriber is already subscribed");this.subscribers.add(e)},e.prototype.unsubscribe=function(e){this.subscribers.delete(e)},e}();!function(){function e(){var e=this;this._state="pending",this._promise=new Promise((function(t,n){e._resolve=t,e._reject=n}))}Object.defineProperty(e.prototype,"state",{get:function(){return this._state},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"promise",{get:function(){return this._promise},enumerable:!1,configurable:!0}),e.prototype.then=function(e,t){return this._promise.then(e,t)},e.prototype.catch=function(e){return this._promise.catch(e)},e.prototype.finally=function(e){return this._promise.finally(e)},e.prototype.resolve=function(e){this._resolve(e),this._state="fulfilled"},e.prototype.reject=function(e){this._reject(e),this._state="rejected"}}(),Symbol.toStringTag;var o=function(e,t,n){void 0===n&&(n={}),e.addEventListener("keypress",(function(r){"Enter"!==r.key&&"NumpadEnter"!==r.key||(n.toggleChecked&&(e.checked=!e.checked),t(r))}))},s=function(e,t,n){void 0===n&&(n={}),e.addEventListener("change",(function(e){t(e)})),o(e,t,n)};function l(e){var t=[];if(0===e.length)return"";if("string"!=typeof e[0])throw new TypeError("Url must be a string. Received "+e[0]);if(e[0].match(/^[^/:]+:\/*$/)&&e.length>1){var n=e.shift();e[0]=n+e[0]}e[0].match(/^file:\/\/\//)?e[0]=e[0].replace(/^([^/:]+):\/*/,"$1:///"):e[0]=e[0].replace(/^([^/:]+):\/*/,"$1://");for(var r=0;r<e.length;r++){var i=e[r];if("string"!=typeof i)throw new TypeError("Url must be a string. Received "+i);""!==i&&(r>0&&(i=i.replace(/^[\/]+/,"")),i=r<e.length-1?i.replace(/[\/]+$/,""):i.replace(/[\/]+$/,"/"),t.push(i))}var o=t.join("/"),s=(o=o.replace(/\/(\?|&|#[^!])/g,"$1")).split("?");return s.shift()+(s.length>0?"?":"")+s.join("&")}function a(){return l("object"==typeof arguments[0]?arguments[0]:[].slice.call(arguments))}var c=function(e,t,n,r){return new(n||(n=Promise))((function(i,o){function s(e){try{a(r.next(e))}catch(e){o(e)}}function l(e){try{a(r.throw(e))}catch(e){o(e)}}function a(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,l)}a((r=r.apply(e,t||[])).next())}))},h=function(e,t){var n,r,i,o,s={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:l(0),throw:l(1),return:l(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function l(o){return function(l){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;s;)try{if(n=1,r&&(i=2&o[0]?r.return:o[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,o[1])).done)return i;switch(r=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return s.label++,{value:o[1],done:!1};case 5:s.label++,r=o[1],o=[0];continue;case 7:o=s.ops.pop(),s.trys.pop();continue;default:if(!((i=(i=s.trys).length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){s=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){s.label=o[1];break}if(6===o[0]&&s.label<i[1]){s.label=i[1],i=o;break}if(i&&s.label<i[2]){s.label=i[2],s.ops.push(o);break}i[2]&&s.ops.pop(),s.trys.pop();continue}o=t.call(e,s)}catch(e){o=[6,e],r=0}finally{n=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,l])}}};function u(e){return c(this,void 0,void 0,(function(){var t;return h(this,(function(n){switch(n.label){case 0:return[4,fetch(a("https://guessir-api.k-k.io","texts/".concat(e)),{method:"GET"})];case 1:if(!(t=n.sent()).ok)throw new Error("Could not load text");return[4,t.json()];case 2:return[2,n.sent()]}}))}))}var d=function(){function e(e){void 0===e&&(e={}),this.guessPubSub=new i,this.showFirstLettersPubSub=new i,this.showTextPubSub=new i,this.isTextShown=!1,this.isFirstLettersShown=!1,this.guessEvent=this.guessPubSub.event,this.showFirstLettersEvent=this.showFirstLettersPubSub.event,this.showTextEvent=this.showTextPubSub.event;var t=e.allowShowingFirstLetters,n=e.allowShowingText;this.containerElement=document.createElement("div"),this.containerElement.id="controls-container",this.initElement(n,t)}return e.prototype.getElement=function(){return this.containerElement},e.prototype.cleanAndFocusGuessInput=function(){var e=this.getElements().guessInputElement;e.value="",e.focus()},e.prototype.initElement=function(e,t){var n,r;this.containerElement.innerHTML='\n      <input id="guess-input" type="text" />\n      <button id="guess-button" type="button">Guess</button>\n      <label>\n        <input type="checkbox" id="show-text-checkbox" /> Show text\n      </label>\n      <label>\n        <input type="checkbox" id="show-first-letters-checkbox"> Show first letters\n      </label>\n    ';var i=this.getElements(),o=i.showTextCheckboxElement,s=i.showFirstLettersCheckboxElement;e||null===(n=o.parentElement)||void 0===n||n.classList.add("hide"),t||null===(r=s.parentElement)||void 0===r||r.classList.add("hide"),this.attachGuessHandler(),this.attachShowFirstLettersHandler(),this.attachShowTextHandler()},e.prototype.getElements=function(){return{showTextCheckboxElement:this.containerElement.querySelector("#show-text-checkbox"),showFirstLettersCheckboxElement:this.containerElement.querySelector("#show-first-letters-checkbox"),guessButtonElement:this.containerElement.querySelector("#guess-button"),guessInputElement:this.containerElement.querySelector("#guess-input")}},e.prototype.attachGuessHandler=function(){var e=this,t=this.getElements(),n=t.guessButtonElement,r=t.guessInputElement,i=function(){var t=r.value.trim().toLowerCase();t&&e.guessPubSub.publish({word:t})};n.addEventListener("click",i),o(r,i)},e.prototype.attachShowTextHandler=function(){var e=this,t=this.getElements(),n=t.showTextCheckboxElement,r=t.showFirstLettersCheckboxElement;s(n,(function(){e.isFirstLettersShown&&r.dispatchEvent(new Event("change")),e.isTextShown=!e.isTextShown,n.checked=e.isTextShown,e.showTextPubSub.publish(e.isTextShown)}))},e.prototype.attachShowFirstLettersHandler=function(){var e=this,t=this.getElements(),n=t.showTextCheckboxElement,r=t.showFirstLettersCheckboxElement;s(r,(function(){e.isTextShown&&n.dispatchEvent(new Event("change")),e.isFirstLettersShown=!e.isFirstLettersShown,r.checked=e.isFirstLettersShown,e.showFirstLettersPubSub.publish(e.isFirstLettersShown)}))},e}(),p=function(){function e(e){void 0===e&&(e={}),this.generatedUrl="",this.copiedAlertElement=document.createElement("div"),this.maxTitleLength=0,this.maxDescriptionLength=0,this.maxTextLength=0;var t=e.maxTitleLength,n=void 0===t?500:t,r=e.maxDescriptionLength,i=void 0===r?4e3:r,o=e.maxTextLength,s=void 0===o?4e3:o;this.containerElement=document.createElement("div"),this.containerElement.id="utils-container",this.maxTitleLength=n,this.maxDescriptionLength=i,this.maxTextLength=s,this.copiedAlertElement.textContent="(copied)",this.initElement()}return e.prototype.getElement=function(){return this.containerElement},e.prototype.initElement=function(){this.containerElement.innerHTML='\n      <details>\n        <summary>Create a new text</summary>\n        <div>\n          <div class="inline-flex relative">\n            <input id="title-input" type="text" placeholder="Title*">\n            <div class="limit-text">0/0</div>\n          </div>\n        </div>\n        <div>\n          <div class="inline-flex relative">\n            <textarea rows="2" class="w-100" id="description-input" placeholder="Description"></textarea>\n            <div class="limit-text">0/0</div>\n          </div>\n        </div>\n        <div class="flex relative">\n            <textarea rows="5" class="w-100" id="text-input" placeholder="Text*"></textarea>\n            <div class="limit-text">0/0</div>\n        </div>\n        <div class="flex">\n          <label>\n            <input checked type="checkbox" id="allow-showing-first-letters-checkbox">Allow showing first letters\n          </label>\n          <br />\n          <label>\n            <input checked type="checkbox" id="allow-showing-text-checkbox">Allow showing text\n          </label>\n        </div>\n        <div id="generate-url-button-container">\n          <div class="relative">\n            <div id="generate-url-error" class="error hide"></div>\n            <button id="generate-url-button" type="button">Create</button>\n          </div>\n        </div>\n        <div class="hide flex" id="generated-url-container">\n          <button id="copy-generated-url-button" type="button">\n            '.concat('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">\n  <path\n    d="M18 21H12C11.2044 21 10.4413 20.6839 9.87868 20.1213C9.31607 19.5587 9 18.7956 9 18V12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9H18C18.7956 9 19.5587 9.31607 20.1213 9.87868C20.6839 10.4413 21 11.2044 21 12V18C21 18.7956 20.6839 19.5587 20.1213 20.1213C19.5587 20.6839 18.7956 21 18 21ZM12 11C11.7348 11 11.4804 11.1054 11.2929 11.2929C11.1054 11.4804 11 11.7348 11 12V18C11 18.2652 11.1054 18.5196 11.2929 18.7071C11.4804 18.8946 11.7348 19 12 19H18C18.2652 19 18.5196 18.8946 18.7071 18.7071C18.8946 18.5196 19 18.2652 19 18V12C19 11.7348 18.8946 11.4804 18.7071 11.2929C18.5196 11.1054 18.2652 11 18 11H12Z"\n    fill="#C7C7C7"\n  />\n  <path\n    d="M9.73 15H5.67C4.96268 14.9974 4.28509 14.7152 3.78494 14.2151C3.28478 13.7149 3.00263 13.0373 3 12.33V5.67C3.00263 4.96268 3.28478 4.28509 3.78494 3.78494C4.28509 3.28478 4.96268 3.00263 5.67 3H12.33C13.0373 3.00263 13.7149 3.28478 14.2151 3.78494C14.7152 4.28509 14.9974 4.96268 15 5.67V9.4H13V5.67C13 5.49231 12.9294 5.32189 12.8038 5.19624C12.6781 5.07059 12.5077 5 12.33 5H5.67C5.49231 5 5.32189 5.07059 5.19624 5.19624C5.07059 5.32189 5 5.49231 5 5.67V12.33C5 12.5077 5.07059 12.6781 5.19624 12.8038C5.32189 12.9294 5.49231 13 5.67 13H9.73V15Z"\n    fill="#C7C7C7"\n  />\n</svg>\n','\n          </button>\n          <a href="#" id="generated-url" target="_blank">#</a>\n        </div>\n      </details>\n    '),this.attachInputHandlers(),this.attachGenerateUrlHandler(),this.attachCopyGeneratedUrlHandler()},e.prototype.getElements=function(){return{titleInputElement:(e=this.containerElement).querySelector("#title-input"),descriptionInputElement:e.querySelector("#description-input"),textInputElement:e.querySelector("#text-input"),allowShowingFirstLettersCheckboxElement:e.querySelector("#allow-showing-first-letters-checkbox"),allowShowingTextCheckboxElement:e.querySelector("#allow-showing-text-checkbox"),generateUrlButtonElement:e.querySelector("#generate-url-button"),errorElement:e.querySelector("#generate-url-error"),generatedUrlContainerElement:e.querySelector("#generated-url-container"),generatedUrlElement:e.querySelector("#generated-url"),copyGeneratedUrlButtonElement:e.querySelector("#copy-generated-url-button")};var e},e.prototype.getValues=function(){var e=this.getElements(),t=e.titleInputElement,n=e.descriptionInputElement,r=e.textInputElement,i=e.allowShowingFirstLettersCheckboxElement,o=e.allowShowingTextCheckboxElement;return{title:t.value.trim(),description:n.value.trim()||void 0,text:r.value.trim(),allowShowingFirstLetters:i.checked,allowShowingText:o.checked}},e.prototype.limitInputsLength=function(){var e=this.getElements(),t=e.titleInputElement,n=e.descriptionInputElement,r=e.textInputElement,i=function(e,t){var n,r=e.value.trim();r.length>t&&(r=r.substring(0,t),e.value=r);var i=null===(n=e.parentElement)||void 0===n?void 0:n.querySelector(".limit-text");i&&(i.innerHTML="".concat(r.length,"/").concat(t))};i(t,this.maxTitleLength),i(n,this.maxDescriptionLength),i(r,this.maxTextLength)},e.prototype.validateForm=function(e){var t=this.getElements(),n=t.titleInputElement,r=t.textInputElement,i=this.getValues(),o=i.title,s=i.text,l=Boolean(o&&s);return e&&e!==n||(o?n.classList.remove("invalid"):n.classList.add("invalid")),e&&e!==r||(s?r.classList.remove("invalid"):r.classList.add("invalid")),l},e.prototype.blockForm=function(e){var t=this.getElements();[t.titleInputElement,t.descriptionInputElement,t.textInputElement,t.allowShowingFirstLettersCheckboxElement,t.allowShowingTextCheckboxElement,t.generateUrlButtonElement].forEach((function(t){t.disabled=e}))},e.prototype.cleanForm=function(){var e=this.getElements(),t=e.titleInputElement,n=e.descriptionInputElement,r=e.textInputElement,i=e.allowShowingFirstLettersCheckboxElement,o=e.allowShowingTextCheckboxElement;[t,n,r].forEach((function(e){e.value=""})),[i,o].forEach((function(e){e.checked=!0}))},e.prototype.attachInputHandlers=function(){var e=this,t=this.getElements(),n=t.titleInputElement,r=t.descriptionInputElement,i=t.textInputElement,o=t.allowShowingFirstLettersCheckboxElement,l=t.allowShowingTextCheckboxElement;this.limitInputsLength(),[n,r,i].forEach((function(t){t.addEventListener("input",(function(t){e.handleInputsChange(t.currentTarget)}))})),[o,l].forEach((function(t){s(t,(function(t){e.handleInputsChange(t.currentTarget)}),{toggleChecked:!0})}))},e.prototype.handleInputsChange=function(e){var t=this.getElements(),n=t.errorElement,r=t.generatedUrlContainerElement;n.classList.add("hide"),r.classList.add("hide"),this.removeCopyAlert(),this.limitInputsLength(),this.validateForm(e)},e.prototype.attachGenerateUrlHandler=function(){var e=this,t=this.getElements(),n=t.generateUrlButtonElement,r=t.errorElement,i=t.generatedUrlContainerElement,o=t.generatedUrlElement;n.addEventListener("click",(function(){e.validateForm()&&(e.blockForm(!0),i.classList.add("hide"),function(e){return c(this,void 0,void 0,(function(){var t;return h(this,(function(n){switch(n.label){case 0:return n.trys.push([0,3,,4]),[4,fetch(a("https://guessir-api.k-k.io","texts"),{method:"POST",body:JSON.stringify(e),headers:{"Content-Type":"application/json"}})];case 1:if(!(t=n.sent()).ok)throw new Error("Request failed");return[4,t.json()];case 2:return[2,n.sent()];case 3:throw n.sent(),new Error("Could not create text");case 4:return[2]}}))}))}(e.getValues()).then((function(t){e.cleanForm(),e.generatedUrl=function(e){return"".concat(window.location.origin,"?textId=").concat(e.id)}(t),i.classList.remove("hide"),o.textContent=e.generatedUrl,o.href=e.generatedUrl})).catch((function(e){console.error(e),r.classList.remove("hide"),r.textContent=e.message})).finally((function(){e.blockForm(!1)})))}))},e.prototype.removeCopyAlert=function(){var e=this.getElements().copyGeneratedUrlButtonElement;e.contains(this.copiedAlertElement)&&e.removeChild(this.copiedAlertElement)},e.prototype.attachCopyGeneratedUrlHandler=function(){var e,t=this,n=this.getElements().copyGeneratedUrlButtonElement;n.addEventListener("click",(function(){navigator.clipboard.writeText(t.generatedUrl),n.appendChild(t.copiedAlertElement),e&&clearTimeout(e),e=setTimeout((function(){t.removeCopyAlert()}),5e3)}))},e}(),m=function(){function e(e){this.wordLikeCount=0,this.score=0;var t=e.wordLikeCount;this.wordLikeCount=t,this.containerElement=document.createElement("div"),this.containerElement.id="score-container",this.initElement()}return e.prototype.getElement=function(){return this.containerElement},e.prototype.addScore=function(e){this.score+=e,this.getElements().currentScoreElement.textContent=this.score.toString()},e.prototype.initElement=function(){this.containerElement.innerHTML='\n      Score:&nbsp;\n      <div id="current-score">'.concat(this.score,'</div>\n      /\n      <div id="total-score">').concat(this.wordLikeCount,"</div>\n    ")},e.prototype.getElements=function(){return{currentScoreElement:this.containerElement.querySelector("#current-score")}},e}(),f=function(){function e(e){this.userWordShowPubSub=new i,this.isShown=!1,this.userWordShowEvent=this.userWordShowPubSub.event;var t=e.lexeme;this.lexeme=t,this.containerElement=document.createElement("button"),this.containerElement.classList.add("lexeme-container"),this.initElement()}return e.prototype.getElement=function(){return this.containerElement},e.prototype.show=function(){this.isShown=!0,this.containerElement.classList.add("show")},e.prototype.initElement=function(){this.containerElement.innerHTML='\n      <span class="lexeme">'.concat(this.lexeme.normalized,'</span>\n      <span class="lexeme-first-letter">').concat(this.lexeme.normalized[0],"</span>\n    "),this.attachClickHandler()},e.prototype.attachClickHandler=function(){var e=this;this.containerElement.addEventListener("click",(function(){e.isShown||(e.show(),e.userWordShowPubSub.publish(e.lexeme))}))},e}(),w=function(e){var t="function"==typeof Symbol&&Symbol.iterator,n=t&&e[t],r=0;if(n)return n.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&r>=e.length&&(e=void 0),{value:e&&e[r++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},v=function(e,t){var n="function"==typeof Symbol&&e[Symbol.iterator];if(!n)return e;var r,i,o=n.call(e),s=[];try{for(;(void 0===t||t-- >0)&&!(r=o.next()).done;)s.push(r.value)}catch(e){i={error:e}}finally{try{r&&!r.done&&(n=o.return)&&n.call(o)}finally{if(i)throw i.error}}return s},x=function(){function e(e){this.userWordShowPubSub=new i,this.wordRenderers=new Map,this.userWordShowEvent=this.userWordShowPubSub.event;var t=e.lexemesAnalysis,n=e.title,r=e.description;this.lexemesAnalysis=t,this.title=n,this.description=r,this.containerElement=document.createElement("div"),this.containerElement.id="text-container",this.initElement()}return e.prototype.getElement=function(){return this.containerElement},e.prototype.showLexemesByWord=function(e){var t,n,r=this.lexemesAnalysis.lexemesByWordLike.get(e),i=0;if(!r)return i;try{for(var o=w(r),s=o.next();!s.done;s=o.next()){var l=v(s.value,1)[0],a=this.wordRenderers.get(l);if(a){var c=a.isShown;a.show(),c||i++}}}catch(e){t={error:e}}finally{try{s&&!s.done&&(n=o.return)&&n.call(o)}finally{if(t)throw t.error}}return i},e.prototype.toggleText=function(e){this.containerElement.classList.remove("show-text","show-first-letters"),e?this.containerElement.classList.add("show-text"):this.containerElement.classList.remove("show-text")},e.prototype.toggleFirstLetters=function(e){this.containerElement.classList.remove("show-text","show-first-letters"),e?this.containerElement.classList.add("show-first-letters"):this.containerElement.classList.remove("show-first-letters")},e.prototype.initElement=function(){var e,n,r=this;this.containerElement.innerHTML='\n      <h1 id="title" class="hide"></h1>\n      <p id="description" class="hide"></p>\n      <div id="lexemes"></div>\n    ';var i,o={titleElement:(i=this.containerElement).querySelector("#title"),descriptionElement:i.querySelector("#description"),lexemesElement:i.querySelector("#lexemes")},s=o.titleElement,l=o.descriptionElement,a=o.lexemesElement;this.title&&(s.classList.remove("hide"),s.textContent=this.title),this.description&&(l.classList.remove("hide"),l.textContent=this.description);try{for(var c=w(this.lexemesAnalysis.lexemes),h=c.next();!h.done;h=c.next()){var u=v(h.value,2),d=u[0],p=u[1];if(t.isLexemeOtherCharacter(p))a.append(this.wrapSpecialCharacter(p));else{var m=new f({lexeme:p});m.userWordShowEvent.subscribe((function(e){return r.handleUserWordShow(e)})),this.wordRenderers.set(d,m),a.appendChild(m.getElement())}}}catch(t){e={error:t}}finally{try{h&&!h.done&&(n=c.return)&&n.call(c)}finally{if(e)throw e.error}}},e.prototype.wrapSpecialCharacter=function(e){return"\n"===e.normalized?document.createElement("br"):e.normalized},e.prototype.handleUserWordShow=function(e){this.userWordShowPubSub.publish(e)},e}(),E=function(){function e(e){var t=e.lexemesAnalysis,n=e.title,r=e.description,i=e.allowShowingText,o=e.allowShowingFirstLetters,s=e.textRenderer,l=e.controlsRenderer,a=e.scoreRenderer,c=e.createTextRenderer;this.guessirContainer=document.createElement("div"),this.guessirContainer.id="guessir",this.textRenderer=s||new x({lexemesAnalysis:t,title:n,description:r}),this.controlsRenderer=l||new d({allowShowingText:i,allowShowingFirstLetters:o}),this.scoreRenderer=a||new m({wordLikeCount:t.wordLikeCount}),this.utilsRenderer=c||new p}return e.prototype.init=function(e){var t=this;e.appendChild(this.guessirContainer),this.textRenderer.userWordShowEvent.subscribe((function(e){return t.handleUserWordShow(e)})),this.controlsRenderer.guessEvent.subscribe((function(e){return t.handleGuess(e)})),this.controlsRenderer.showTextEvent.subscribe((function(e){return t.handleShowText(e)})),this.controlsRenderer.showFirstLettersEvent.subscribe((function(e){return t.handleShowFirstLetters(e)})),this.guessirContainer.appendChild(this.textRenderer.getElement()),this.guessirContainer.appendChild(this.controlsRenderer.getElement()),this.guessirContainer.appendChild(this.scoreRenderer.getElement()),this.guessirContainer.appendChild(this.utilsRenderer.getElement())},e.prototype.handleUserWordShow=function(e){this.scoreRenderer.addScore(-1)},e.prototype.handleGuess=function(e){var t=e.word,n=this.textRenderer.showLexemesByWord(t);n&&this.controlsRenderer.cleanAndFocusGuessInput(),this.scoreRenderer.addScore(n)},e.prototype.handleShowText=function(e){this.textRenderer.toggleText(e),e&&this.scoreRenderer.addScore(-7)},e.prototype.handleShowFirstLetters=function(e){this.textRenderer.toggleFirstLetters(e),e&&this.scoreRenderer.addScore(-2)},e}();!function(e){var t,n,i,o;t=this,n=void 0,o=function(){var t,n,i,o,s,l,a,c;return function(e,t){var n,r,i,o,s={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:l(0),throw:l(1),return:l(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function l(o){return function(l){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;s;)try{if(n=1,r&&(i=2&o[0]?r.return:o[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,o[1])).done)return i;switch(r=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return s.label++,{value:o[1],done:!1};case 5:s.label++,r=o[1],o=[0];continue;case 7:o=s.ops.pop(),s.trys.pop();continue;default:if(!((i=(i=s.trys).length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){s=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){s.label=o[1];break}if(6===o[0]&&s.label<i[1]){s.label=i[1],i=o;break}if(i&&s.label<i[2]){s.label=i[2],s.ops.push(o);break}i[2]&&s.ops.pop(),s.trys.pop();continue}o=t.call(e,s)}catch(e){o=[6,e],r=0}finally{n=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,l])}}}(this,(function(h){switch(h.label){case 0:if(t="In order to create your own text find the form below.",n="Hello!",i="I am a simple tool to turn any English text into a word guessing game.",o=!0,s=!0,!new URLSearchParams(window.location.search).get("textId"))return[3,4];h.label=1;case 1:return h.trys.push([1,3,,4]),console.log("Trying to load text..."),[4,u(function(){var e=new URLSearchParams(window.location.search).get("textId");if(!e)throw new Error("Text ID is empty");return e}())];case 2:return l=h.sent(),console.log("Text has been loaded",l),t=l.text,n=l.title,o=l.allowShowingText,s=l.allowShowingFirstLetters,i=l.description,[3,4];case 3:return a=h.sent(),console.log("Text has been failed to load",a),console.error(a),t="\n  I could not load the remote text. Please, verify your URL or create a new text.\n",[3,4];case 4:return c=(new r).analyze(t),new E({lexemesAnalysis:c,title:n,description:i,allowShowingText:o,allowShowingFirstLetters:s}).init(e),[2]}}))},new((i=void 0)||(i=Promise))((function(e,r){function s(e){try{a(o.next(e))}catch(e){r(e)}}function l(e){try{a(o.throw(e))}catch(e){r(e)}}function a(t){var n;t.done?e(t.value):(n=t.value,n instanceof i?n:new i((function(e){e(n)}))).then(s,l)}a((o=o.apply(t,n||[])).next())}))}(document.body)})();