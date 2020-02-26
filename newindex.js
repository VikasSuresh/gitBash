var execSync=require('child_process').execSync;

console.log(execSync('ncu -u -x /^express/').toString())