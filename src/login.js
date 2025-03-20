

//global variables
var logSerialNumber = 0;
function Page_Init() {

    checkUserCredential();
    function getListMessage(pageNumber, pageSize) {
        var result = [];
        var msg = {
            PageNumber: pageNumber,
            PageSize: pageSize,
            CustomerNumber: CustomerNumber.IsEmpty() ? null: CustomerNumber.Val()
        }
        result[0] = msg;
        return result;
    }

    function getListParameters(pageNumber) {
        PinResetHistory.ResetPaging();
        var params = PinResetHistory.GetPagingParams();
        return getListMessage(pageNumber, params.pageSize);
    }

    page.SetMethod('save', {
        method: function () {
            return "Page_Save";
        },
        validate: function () {
            page.IsEmpty({ item: CustomerNumber, caption: 'CustomerNumber' });
            page.IsEmpty({ item: CardNumber, caption: 'CardNumber' });
            page.IsEmpty({ item: CardRefNumber, caption: 'CardRefNumber' });
            page.IsEmpty({ item: ReasonCode, caption: 'ReasonCode' });
            page.IsEmpty({ item: Explanation, caption: 'Explanation' });
            return true;
        },
        onSuccess: function (result) {                     
        }
    });

    page.SetMethod('list', {
        onSuccess: function (result) {

            if (result.length == 0) {
                fora.Alert('EmptyQueryResult');
            }
            PinResetHistory.Val(result);
        },
        params: function () {
            return getListParameters(1);
        },
        validate: function () {
            return true;
        }
    });

    PinResetHistory.List = function (pageNumber, pageSize, filter) {
        var methodInfo = {
            method: 'Page_List',
            params: getListMessage(pageNumber, pageSize),
            onSuccess: function (result) { PinResetHistory.Val(result); }
        }
        page.Query(methodInfo);
    }

    toolbar.HistoryToExcel = function () {
        toExcel();
    }
    function toExcel() {
        var msg = getListMessage(1, 10000); 
        window.open(rootFolder + "/FileServer.aspx?action=dprsr&msg=" + JSON.stringify(msg[0]), '', 'width=10,height=10');
    }

    GetCardList.GetCardListClick = function () {

        var methodInfo = {
            method: 'GetCustomerCardList',
            params: getCardListMessage(1, 10),
            validate: function () {
                if (CustomerNumber.IsEmpty())
                    fora.Throw('missinginfox', fora.SM('CustomerNumber'));
                return true;
            },
            onSuccess: function (result) {
                DebitCardList.Val(result);

                fora.$('divCardList').show();
                var methodInfo = {
                    id: 'pnldivCardList',
                    title: fora.SM('DebitCardList'),
                    div: 'divCardList',
                    height: 300,
                    width: 635
                }

                page.DialogManager.Open(methodInfo);
            }
        }
        page.Query(methodInfo);

    }

    DebitCardList.List = function (pageNumber, pageSize) {

        var methodInfo = {
            method: 'GetCustomerCardList',
            params: getCardListMessage(pageNumber, pageSize),
            onSuccess: function (result) {
                DebitCardList.Val(result);
            }
        }
        page.Query(methodInfo);

    }
    function getCardListMessage(pageNumber, pageSize) {
        var result = [];

        var msg = {
            CustomerNumber: CustomerNumber.Val(),
            PageNumber: pageNumber,
            PageSize: pageSize
        }

        result[0] = msg;
        return result;
    }
    function ApproveOrReject(id, methodName) {
        var msgRes;
        var methodInfoMessageId = {
            method: 'GetApprovalDetailMessage',
            params: [id],
            onSuccess: function (result) {
                if (result != null) {
                    msgRes = result;
                }
            }
        }
        page.Query(methodInfoMessageId);
        var methodInfoApprove = {
            method: methodName,
            params: [msgRes],
            onError: function (result) {
                if (result != null) {
                    page.DialogManager.Close('ApprovalDetailList');
                    var info = document.getElementById("approvalInfo");
                    info.innerHTML = result;
                }
            },
            onSuccess: function (result) {
                page.DialogManager.Close('ApprovalDetailList');
                document.getElementById("RefreshBtn_Refresh").click();
                var info = document.getElementById("approvalInfo");
                info.innerHTML = result.Message;
            }
        }
        page.Query(methodInfoApprove);
    }

    DebitCardList.OnAfterSelect = function (rowId) {

        if (DebitCardList.Rows()[rowId].CardStatusCode != 'N') {
            fora.Throw(fora.SM('PinResetIsAllowedOnlyNormalCards'));
        }

        CardNumber.Val(DebitCardList.Rows()[rowId].CardNumber);
        CardRefNumber.Val(DebitCardList.Rows()[rowId].CardRefNumber);
        ShadowCardNumber.Val(DebitCardList.Rows()[rowId].ShadowCardNumber);
        MaskedCardNumber.Val(DebitCardList.Rows()[rowId].MaskedCardNumber);
        CardTitle.Val(DebitCardList.Rows()[rowId].CardTitle);
        page.DialogManager.Close('pnldivCardList');
    }

    toolbar.OpenApprovalList = function () {
        var methodInfoApprove = {
            id: 'ApprovalList',
            title: fora.SM('ApprovalList'),
            div: 'divApprovalList',
            height: 400,
            width: 700
        }
        page.DialogManager.Open(methodInfoApprove);

        var methodInfoApproveList = {
            method: 'GetApprovaList',
            params: [1, 10],
            onSuccess: function (result) {
                if (result != null) {
                    document.getElementById("approvalInfo").innerHTML = "";
                    ApprovalList.Val(result);
                }
            }
        }
        page.Query(methodInfoApproveList);
    }

    ApprovalList.List = function (pageNumber, pageSize) {
        var methodInfo = {
            method: 'GetApprovaList',
            params: [pageNumber, pageSize],
            onSuccess: function (result) {
                if (result != null) {
                    document.getElementById("approvalInfo").innerHTML = "";
                    ApprovalList.Val(result);
                }
            }
        }
        page.Query(methodInfo);
    }

    ApprovalList.OnAfterSelect = function (rowId) {
        logSerialNumber = ApprovalList.Rows()[rowId].LogSerialNumber;
        var methodInfoDetailList = {
            method: 'GetApprovalDetailMessage',
            params: [logSerialNumber],
            onSuccess: function (result) {
                
                if (result != null) {
                    const allowedKeys = [
                        "MaskedCardNumber",
                        "CardRefNumber",
                        "ReasonCode",
                        "Explanation"
                    ];

                    var value = Object.keys(result)
                        .filter(Key => allowedKeys.includes(Key))
                        .map(Key => {
                            return { Key: fora.SM(Key), Value: result[Key] };
                        });

                    value.unshift({ Key: "&nbsp", Value: "VALUE" });
                    ApprovalDetailList.Val(value);
                }
            }
        }
        page.Query(methodInfoDetailList);

        var methodInfoDetail = {
            id: 'ApprovalDetailList',
            title: fora.SM('ApprovalDetailList'),
            div: 'divApprovalDetailList',
            height: 320,
            width: 400
        }
        page.DialogManager.Open(methodInfoDetail);
    }

    Btn.ApprovalBtn = function () {
        ApproveOrReject(logSerialNumber, "Approve");
    }

    Btn.RejectedBtn = function () {
        ApproveOrReject(logSerialNumber, "Reject");
    }

    RefreshBtn.RefreshBtn = function () {
        var methodInfoRefresh = {
            method: 'GetApprovaList',
            params: [1, 10],
            onSuccess: function (result) {
                if (result != null) {
                    ApprovalList.Val(result);
                }
            }
        }
        page.Query(methodInfoRefresh);
    }
}

function Page_Load() {
    fora.$('divCardList').hide();
    fora.$('divApprovalList').hide();
    fora.$('divApprovalDetailList').hide();
}

function checkUserCredential() {
    var methodInfo = {
        method: 'CheckApprovalAuth',
        params: [],
        onSuccess: function (result) {
            toolbar.GetButton("ApprovingList").Hide();
            if (result) {
                toolbar.GetButton("ApprovingList").Show();
            }
        }
    }
    page.Query(methodInfo);
}
