document.addEventListener("DOMContentLoaded",function codemain(){
    const searchbutton=document.getElementById("Searchbutton");
    const inputbox=document.getElementById("inputbox")
    const easycircle=document.getElementById("progressitem-easy")
    const mediumcircle=document.getElementById("progressitem-medium")
    const hardcircle=document.getElementById("progressitem-hard")
    const statcards=document.getElementById("statcard")
    const easylabel=document.getElementById("easy")
    const medlabel=document.getElementById("medium")
    const hardlabel=document.getElementById("hard")
    function checkusername(username){
        if(username.trim()===""){
            alert("No Username Entered!")
            return false
        }
        const regexexp= /^[a-zA-Z0-9]+$/;
        if(!regexexp.test(username)){
            alert("Invalid Username!")
        }
        return regexexp.test(username)
    }
    async function fetchuserdetails(username){
            try{searchbutton.innerText="Searching..."
            searchbutton.disabled=true
            const proxyUrl="https://cors-anywhere.herokuapp.com/"
            const url="https://leetcode.com/graphql/"
            const myHeaders=new Headers();
            myHeaders.append("content-type","application/json")
            const graphql = JSON.stringify({
                query: `
                  query userSessionProgress($username: String!) {
                    allQuestionsCount {
                      difficulty
                      count
                    }
                    matchedUser(username: $username) {
                      submitStats {
                        acSubmissionNum {
                          difficulty
                          count
                          submissions
                        }
                        totalSubmissionNum {
                          difficulty
                          count
                          submissions
                        }
                      }
                    }
                  }
                `,
                variables: { username: username }
              });
              const requestoptions={
                method: "POST",
                headers: myHeaders,
                body: graphql,
                redirect: "follow"
              }
            const response=await fetch(proxyUrl+url,requestoptions)
            if(!response.ok){
                throw new Error("Unable to fetch user details")
            }
            const parseddata=await response.json();
            console.log("Logging data: ",parseddata)
            displaydata(parseddata)
    }
    catch(error){
        console.error(error)
        resetProgress(easycircle,easylabel)
        resetProgress(mediumcircle,medlabel)
        resetProgress(hardcircle,hardlabel)
        const para1=document.getElementById("statcardchild")
        para1.textContent="No data found"
    }
    finally{
        searchbutton.innerText="Search"
        searchbutton.disabled=false
    }
}
function resetProgress(circle,label){
    circle.style.setProperty("--progress-degree",`${0}%`)
    label.textContent="Not Applicable"
}
    function updateProgress(total,solved,circle,label,k){
        if(k){const progresspercent=(solved/total)*100
        circle.style.setProperty("--progress-degree",`${progresspercent}%`)
        label.textContent=`${solved}/${total}`
}
    else{
        circle.style.setProperty("--progress-degree",`${0}%`)
    }}
    function displaydata(parseddata){
        const totalquescount=parseddata.data.allQuestionsCount[0].count;
        const toteasyquescount=parseddata.data.allQuestionsCount[1].count;
        const totmediumquescount=parseddata.data.allQuestionsCount[2].count;
        const tothardquescount=parseddata.data.allQuestionsCount[3].count;
        const totalsubmissioncount=parseddata.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const easysubmissioncount=parseddata.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const mediumsubmissioncount=parseddata.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const hardsubmissioncount=parseddata.data.matchedUser.submitStats.acSubmissionNum[3].count;
        updateProgress(toteasyquescount,easysubmissioncount,easycircle,easylabel,true)
        updateProgress(totmediumquescount,mediumsubmissioncount,mediumcircle,medlabel,true)
        updateProgress(tothardquescount,hardsubmissioncount,hardcircle,hardlabel,true)
    }
    searchbutton.addEventListener('click',function searchingjob(){
        const username=inputbox.value
        result=checkusername(username)
        console.log(`Logging username: ${username}`)
        if(checkusername(username))
        {
            fetchuserdetails(username)
        }
        else{
            resetProgress(easycircle,easylabel)
            resetProgress(mediumcircle,medlabel)
            resetProgress(hardcircle,hardlabel)
        }
    })
})