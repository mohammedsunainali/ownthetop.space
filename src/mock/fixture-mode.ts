/** Production stress mode requires explicit diagnostics; normal marketplace data is unchanged. */
export function stressFixtureEnabled(search:string,development=false){const params=new URLSearchParams(search);return params.get("stressFloors")==="220"&&(development||params.get("diagnostics")==="1");}
export function currentStressFixture(){return typeof window!=="undefined"&&stressFixtureEnabled(window.location.search,process.env.NODE_ENV==="development");}
