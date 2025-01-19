import { TplPayload } from "../utils/types.dt"

export const getGeneralTpl = (msg:TplPayload)=>{
  const fx =`
  <!DOCTYPE html>

<html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">

<head>
  <title></title>
  <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
  <meta content="width=device-width, initial-scale=1.0" name="viewport" />
  <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
  <style>
  .hj{
    margin-top:15px;
  }
  .hj td{
    padding:5px;
    font-family:Arial, Helvetica, sans-serif;
    font-size: 12px;
  }
      * {
          box-sizing: border-box;
      }

      body {
          margin: 0;
          padding: 0;
      }

      a[x-apple-data-detectors] {
          color: inherit !important;
          text-decoration: inherit !important;
      }

      #MessageViewBody a {
          color: inherit;
          text-decoration: none;
      }

      p {
          line-height: inherit
      }

      .desktop_hide,
      .desktop_hide table {
          mso-hide: all;
          display: none;
          max-height: 0px;
          overflow: hidden;
      }

      .image_block img+div {
          display: none;
      }

      @media (max-width:620px) {
          .desktop_hide table.icons-inner {
              display: inline-block !important;
          }
          .icons-inner {
              text-align: center;
          }
          .icons-inner td {
              margin: 0 auto;
          }
          .image_block img.big,
          .row-content {
              width: 100% !important;
          }
          .mobile_hide {
              display: none;
          }
          .stack .column {
              width: 100%;
              display: block;
          }
          .mobile_hide {
              min-height: 0;
              max-height: 0;
              max-width: 0;
              overflow: hidden;
              font-size: 0px;
          }
          .desktop_hide,
          .desktop_hide table {
              display: table !important;
              max-height: none !important;
          }
      }
  </style>
</head>

<body style="background-color: #f1f1f1; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
  <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f1f1f1;" width="100%">
      <tbody>
          <tr>
              <td>
                  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; " width="100%">
                      <tbody>
                          <tr>
                              <td>
                                  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px;" width="600">
                                      <tbody>
                                          <tr>
                                              <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px; background:white;"
                                                  width="100%">
                                                  <table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                                      <tr>
                                                          <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                                              <div align="center" class="alignment" style="line-height:10px"><img class="big" src="${msg.config.banner}" style="display: block; height: auto; border: 0; width: 600px; max-width: 100%;" width="600" /></div>
                                                          </td>
                                                      </tr>
                                                  </table>
                                                  <table border="0" cellpadding="10" cellspacing="0" class="heading_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                                      <tr>
                                                          <td class="pad">
                                                              <span style="margin: 0; color: #10c8da; direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 18px;  letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0;"><span class="tinyMce-placeholder">
                                Hello ${msg.name}
                              </span></span>
                                                          </td>
                                                      </tr>
                                                  </table>
                                                  <table border="0" cellpadding="10" cellspacing="0" class="divider_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                                      <tr>
                                                          <td class="pad">
                                                              <div align="center" class="alignment">
                                                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                                                      <tr>
                                                                          <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #dddddd;"><span>â€Š</span></td>
                                                                      </tr>
                                                                  </table>
                                                              </div>
                                                          </td>
                                                      </tr>
                                                  </table>
                                                  <table border="0" cellpadding="40" cellspacing="0" class="paragraph_block block-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                                      <tr>
                                                          <td class="pad" style="font-family:Arial, Helvetica, sans-serif; line-height: 30px;">
                              <div style="color:#101112;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
                                                                  <p style="margin: 0;line-height:30px;">${msg.emailHTML}</p>
                                                              </div>
                              <br>
                              <div style="font-size:11px;line-height:18px; color:grey">
                              This email has been sent to you from the ${msg.config.title} Mailing System. You are receiving the email because you are either a staff of client of ${msg.config.title}. If this email has been sent to you, in error, please alert us by email to ${msg.config.infoEmail}. Thank you.
                              </div>
                                                          </td>
                                                      </tr>

                                                  </table>
                                              </td>
                                          </tr>
                                      </tbody>
                                  </table>
                              </td>
                          </tr>
                      </tbody>
                  </table>
                  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                      <tbody>
                          <tr>
                              <td>
                                  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px;" width="600">
                                      <tbody>
                                          <tr>
                                              <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                  width="100%">
                                                  <table border="0" cellpadding="0" cellspacing="0" class="icons_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                                      <tr>
                                                          <td class="pad" style="vertical-align: middle; color: #9d9d9d; font-family: inherit; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
                                                              <table cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                                                  <tr>
                                                                      <td class="alignment" style="vertical-align: middle; text-align: center;">
                                                                          <table style="width:40%;margin:auto;">
                                      <tr>
                                                                                  <td style="vertical-align: middle; text-align: center; padding-top: 5px; padding-bottom: 5px; padding-left: 5px; padding-right: 6px;">
                                          <a href="/" style="color: #9d9d9d; text-decoration: none;" target="_blank">
                                            <img src="https://hch.truden.tech/static-files/fb.png" width="25" alt="">
                                          </a>
                                        </td>
                                                                                  <td style="font-family: Arial, Helvetica, sans-serif; font-size: 15px; color: #9d9d9d; vertical-align: middle; letter-spacing: undefined; text-align: center;">
                                          <a href="/" style="color: #9d9d9d; text-decoration: none;" target="_blank">
                                            <img src="https://hch.truden.tech/static-files/linked.png" width="30" alt="">
                                          </a>
                                        </td>
                                        <td style="font-family: Arial, Helvetica, sans-serif; font-size: 15px; color: #9d9d9d; vertical-align: middle; letter-spacing: undefined; text-align: center;">
                                          <a href="/" style="color: #9d9d9d; text-decoration: none;" target="_blank">
                                            <img src="https://hch.truden.tech/static-files/twitter.png" width="30" alt="">
                                          </a>
                                        </td>
                                        <td style="font-family: Arial, Helvetica, sans-serif; font-size: 15px; color: #9d9d9d; vertical-align: middle; letter-spacing: undefined; text-align: center;">
                                          <a href="/" style="color: #9d9d9d; text-decoration: none;" target="_blank">
                                            <img src="https://hch.truden.tech/static-files/web.png" width="30" alt="">
                                          </a>
                                        </td>
                                                                              </tr>
                                      <tr>
                                        <td rowspan="4" style="text-align: center;">

                                        </td>
                                      </tr>
                                    </table>
                                    <table class="hj" style="width:70%;margin:auto;border-top:1px solid #e1e1e1;">
                                      <tr>
                                        <td style="border-right:1px solid #e1e1e1;">
                                            Privacy Policy
                                        </td>
                                        <td style="border-right:1px solid #e1e1e1;">
                                          Terms Of Service
                                        </td>

                                      </tr>

                                    </table>
                                    <br>
                                    <br>
                                    <table class="hj" style="width:70%;margin:auto;">
                                      <tr>
                                        <td>
                                            TruAuth. All Rights Reserved . ${new Date().getFullYear()}
                                        </td>

                                      </tr>

                                    </table>
                                                                      </td>
                                                                  </tr>
                                                              </table>
                                                          </td>
                                                      </tr>
                                                  </table>
                                              </td>
                                          </tr>
                                      </tbody>
                                  </table>
                              </td>
                          </tr>
                      </tbody>
                  </table>
              </td>
          </tr>
      </tbody>
  </table>
  <!-- End -->
</body>

</html>
  `;
return fx ;

}


