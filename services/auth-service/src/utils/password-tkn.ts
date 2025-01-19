interface AccCreation{
    token:string
  }
  export const accountCreation = (obj: AccCreation)=>{
    return `
        Below is your account activation token
        <div style="font-weight:bold;font-size:25px; margin-top:5px;width:100%; text-align:center:padding:10px;">
          ${obj.token}
        </div>
    `
  }
  