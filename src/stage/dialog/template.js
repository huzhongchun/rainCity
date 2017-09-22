export const templateStr = `<div class="g-dialog-mask" id="dialog_<%=index%>">
        <div class="g-dialog show">
            <div class="m-dialog-head">
                <canvas class="m-wave-bg" id="canvas" height="270" width="600"></canvas>
                <div class="m-play-btn"></div>
            </div>
            <div class="m-dialog-content">
                <div class="m-dialog-title break">
                    <span class="m-user">@<%- user %></span>
                    <span class="m-time"><%= time %></span>
                </div>
                <div class="m-dialog-music-title"> <%= position %></div>
                <div class="m-dialog-content-text">
                    <%- content %>
                </div>

            </div>
            <div class="m-dialog-footer">
                <button type="button" class="m-share-tip-btn"><span>分享给朋友</span></button>
                <button type="button" class="m-share-qr-btn"><span>贡献我的雨声</span></button>
            </div>
            <div class="m-qr-block">
                <img src="${process.env.CDN_PREFIX}/images/dialog/qr_img.jpg" alt="新世相" class="m-qr-image"/>
            </div>
            <div class="m-close-btn"></div>
        </div>
        <div class="m-share-tip"></div>
    </div>
`;