"use strict";exports.id=956,exports.ids=[956],exports.modules={6956:(e,l,r)=>{r.d(l,{createConfirmationMessage:()=>i,createKeylessModeMessage:()=>o,keylessLogger:()=>a});var s=r(1689);let o=e=>`
\x1b[35m
[Clerk]:\x1b[0m You are running in keyless mode.
You can \x1b[35mclaim your keys\x1b[0m by visiting ${e.claimUrl}
`,i=()=>`
\x1b[35m
[Clerk]:\x1b[0m Your application is running with your claimed keys.
You can safely remove the \x1b[35m.clerk/\x1b[0m from your project.
`,a=function(){if((0,s.b_)())return global.__clerk_internal_keyless_logger||(global.__clerk_internal_keyless_logger={__cache:new Map,log:function({cacheKey:e,msg:l}){var r;this.__cache.has(e)&&Date.now()<((null==(r=this.__cache.get(e))?void 0:r.expiresAt)||0)||(console.log(l),this.__cache.set(e,{expiresAt:Date.now()+6e5}))}}),globalThis.__clerk_internal_keyless_logger}()}};