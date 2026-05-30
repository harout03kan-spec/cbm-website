const o="6Lcv4PMsAAAAADgeJokEytfxiF7WcfQYAWWQ92lV";function r(){return{getToken:n=>new Promise((t,e)=>{if(typeof window>"u"||!window.grecaptcha){e(new Error("reCAPTCHA not loaded"));return}window.grecaptcha.ready(()=>{window.grecaptcha.execute(o,{action:n}).then(t).catch(e)})})}}export{r as u};
//# sourceMappingURL=useRecaptcha-7nTWIQqS.js.map
