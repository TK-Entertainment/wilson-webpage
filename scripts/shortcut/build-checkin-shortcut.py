# 產生「足跡打卡」iPhone 捷徑：python3 scripts/shortcut/build-checkin-shortcut.py，再用 macOS 的 `shortcuts sign --mode anyone` 簽署
import plistlib, uuid

REPO = "TK-Entertainment/wilson-webpage"
BRANCH = "Release"
OBJ = "￼"

def U(): return str(uuid.uuid4()).upper()

def out(uid, name):  # 前一個動作的輸出
    return {"OutputUUID": uid, "OutputName": name, "Type": "ActionOutput"}
def var(name):       # 具名變數
    return {"VariableName": name, "Type": "Variable"}
def attach(a, agg=None):
    v = dict(a)
    if agg: v["Aggrandizements"] = agg
    return {"Value": v, "WFSerializationType": "WFTextTokenAttachment"}
def tstr(*parts):
    """文字＋變數混排：parts 是字串或 attachment dict"""
    s, rng = "", {}
    for p in parts:
        if isinstance(p, str):
            s += p
        else:
            pos = len(s.encode("utf-16-le")) // 2
            rng[f"{{{pos}, 1}}"] = p
            s += OBJ
    return {"Value": {"string": s, "attachmentsByRange": rng}, "WFSerializationType": "WFTextTokenString"}
def dictfield(items):
    """items: [(key_text, value, type)]，type 0=文字 3=數字"""
    return {"Value": {"WFDictionaryFieldValueItems": [
        {"WFItemType": t, "WFKey": tstr(k), "WFValue": v if isinstance(v, dict) and "WFSerializationType" in v else tstr(v)}
        for k, v, t in items]}, "WFSerializationType": "WFDictionaryFieldValue"}
def act(ident, **params):
    return {"WFWorkflowActionIdentifier": ident, "WFWorkflowActionParameters": params}

A = []
# 0. GitHub token（安裝時會問）
token_uid = U()
A.append(act("is.workflow.actions.gettext", UUID=token_uid, WFTextActionText=""))
A.append(act("is.workflow.actions.setvariable", WFVariableName="token", WFInput=attach(out(token_uid, "文字"))))

# 1. 拍照或從相簿選
g = U()
A.append(act("is.workflow.actions.choosefrommenu", GroupingIdentifier=g, WFControlFlowMode=0,
             WFMenuPrompt="足跡打卡：照片從哪來？", WFMenuItems=["拍照", "從相簿選", "不放照片"]))
A.append(act("is.workflow.actions.choosefrommenu", GroupingIdentifier=g, WFControlFlowMode=1, WFMenuItemTitle="拍照"))
take = U()
A.append(act("is.workflow.actions.takephoto", UUID=take, WFCameraCaptureShowPreview=True))
A.append(act("is.workflow.actions.setvariable", WFVariableName="照片", WFInput=attach(out(take, "照片"))))
A.append(act("is.workflow.actions.choosefrommenu", GroupingIdentifier=g, WFControlFlowMode=1, WFMenuItemTitle="從相簿選"))
sel = U()
A.append(act("is.workflow.actions.selectphoto", UUID=sel, WFSelectMultiplePhotos=True))
A.append(act("is.workflow.actions.setvariable", WFVariableName="照片", WFInput=attach(out(sel, "照片"))))
A.append(act("is.workflow.actions.choosefrommenu", GroupingIdentifier=g, WFControlFlowMode=1, WFMenuItemTitle="不放照片"))
A.append(act("is.workflow.actions.choosefrommenu", GroupingIdentifier=g, WFControlFlowMode=2, UUID=U()))

# 2. 位置：先讀照片的位置，沒有就用現在位置
ploc = U()
A.append(act("is.workflow.actions.properties.images", UUID=ploc, WFContentItemPropertyName="Location", WFInput=attach(var("照片"))))
A.append(act("is.workflow.actions.setvariable", WFVariableName="位置", WFInput=attach(out(ploc, "位置"))))
gi = U()
A.append(act("is.workflow.actions.conditional", GroupingIdentifier=gi, WFControlFlowMode=0, WFCondition=101,
             WFInput={"Type": "Variable", "Variable": attach(var("位置"))}))
cur = U()
A.append(act("is.workflow.actions.getcurrentlocation", UUID=cur))
A.append(act("is.workflow.actions.setvariable", WFVariableName="位置", WFInput=attach(out(cur, "目前位置"))))
A.append(act("is.workflow.actions.conditional", GroupingIdentifier=gi, WFControlFlowMode=2, UUID=U()))
lat = U(); lng = U()
A.append(act("is.workflow.actions.properties.locations", UUID=lat, WFContentItemPropertyName="Latitude", WFInput=attach(var("位置"))))
A.append(act("is.workflow.actions.properties.locations", UUID=lng, WFContentItemPropertyName="Longitude", WFInput=attach(var("位置"))))

# 3. 名稱、分類、一句話
name = U()
A.append(act("is.workflow.actions.ask", UUID=name, WFAskActionPrompt="這裡是哪裡？（地圖上顯示的名稱）", WFInputType="Text"))
catl = U()
A.append(act("is.workflow.actions.list", UUID=catl, WFItems=["旅行", "生活", "出差", "野外"]))
catc = U()
A.append(act("is.workflow.actions.choosefromlist", UUID=catc, WFInput=attach(out(catl, "清單")), WFChooseFromListActionPrompt="分類"))
catd = U()
A.append(act("is.workflow.actions.dictionary", UUID=catd, WFItems=dictfield([("旅行", "trip", 0), ("生活", "life", 0), ("出差", "work", 0), ("野外", "wild", 0)])))
catk = U()
A.append(act("is.workflow.actions.getvalueforkey", UUID=catk, WFInput=attach(out(catd, "辭典")), WFGetDictionaryValueType="Value",
             WFDictionaryKey=tstr(out(catc, "選取的項目"))))
note = U()
A.append(act("is.workflow.actions.ask", UUID=note, WFAskActionPrompt="一句話（可以留空）", WFInputType="Text", WFAllowsMultilineText=True))

# 4. 日期與打卡代號（時間）
# 「格式化日期」一定要明確接「目前日期」：沒給輸入時不會自己用現在時間，會輸出空字串
now = U()
A.append(act("is.workflow.actions.date", UUID=now, WFDateActionMode="Current Date"))
day = U()
A.append(act("is.workflow.actions.format.date", UUID=day, WFDateFormatStyle="Custom", WFDateFormat="yyyy-MM-dd",
             WFDate=tstr(out(now, "日期"))))
pid = U()
A.append(act("is.workflow.actions.format.date", UUID=pid, WFDateFormatStyle="Custom", WFDateFormat="yyyy-MM-dd-HHmmss",
             WFDate=tstr(out(now, "日期"))))
A.append(act("is.workflow.actions.setvariable", WFVariableName="代號", WFInput=attach(out(pid, "格式化的日期"))))

headers = dictfield([("Authorization", tstr("Bearer ", var("token")), 0), ("Accept", "application/vnd.github+json", 0)])

# 5. 每張照片：縮小、轉 JPEG（去掉 GPS 等資訊）、上傳
gr = U()
A.append(act("is.workflow.actions.repeat.each", GroupingIdentifier=gr, WFControlFlowMode=0, WFInput=attach(var("照片"))))
rs = U()
A.append(act("is.workflow.actions.image.resize", UUID=rs, WFImageResizeWidth="1600",
             WFImage=attach(var("Repeat Item"))))
cv = U()
A.append(act("is.workflow.actions.image.convert", UUID=cv, WFImageFormat="JPEG", WFImageCompressionQuality=0.8,
             WFImagePreserveMetadata=False, WFInput=attach(out(rs, "調整大小後的影像"))))
b64 = U()
A.append(act("is.workflow.actions.base64encode", UUID=b64, WFEncodeMode="Encode", WFBase64LineBreakMode="None",
             WFInput=attach(out(cv, "已轉換的影像"))))
A.append(act("is.workflow.actions.downloadurl", UUID=U(), ShowHeaders=True, WFHTTPMethod="PUT", WFHTTPBodyType="JSON",
             WFURL=tstr(f"https://api.github.com/repos/{REPO}/contents/public/img/places/", var("代號"), "/", var("Repeat Index"), ".jpg"),
             WFHTTPHeaders=headers,
             WFJSONValues=dictfield([("message", tstr("足跡打卡照片 ", var("代號")), 0),
                                     ("content", tstr(out(b64, "Base64 編碼的結果")), 0),
                                     ("branch", BRANCH, 0)])))
A.append(act("is.workflow.actions.repeat.each", GroupingIdentifier=gr, WFControlFlowMode=2, UUID=U()))

# 6. 打卡資料（JSON）：最後才上傳，這次建置就會包含照片
data = U()
A.append(act("is.workflow.actions.dictionary", UUID=data, WFItems=dictfield([
    ("name", tstr(out(name, "提供的輸入")), 0),
    ("category", tstr(out(catk, "辭典值")), 0),
    ("date", tstr(out(day, "格式化的日期")), 0),
    ("lat", tstr(out(lat, "緯度")), 3),
    ("lng", tstr(out(lng, "經度")), 3),
    ("text", tstr(out(note, "提供的輸入")), 0),
])))
djson = U()
A.append(act("is.workflow.actions.gettext", UUID=djson, WFTextActionText=tstr(out(data, "辭典"))))
db64 = U()
A.append(act("is.workflow.actions.base64encode", UUID=db64, WFEncodeMode="Encode", WFBase64LineBreakMode="None",
             WFInput=attach(out(djson, "文字"))))
res = U()
A.append(act("is.workflow.actions.downloadurl", UUID=res, ShowHeaders=True, WFHTTPMethod="PUT", WFHTTPBodyType="JSON",
             WFURL=tstr(f"https://api.github.com/repos/{REPO}/contents/content/places/", var("代號"), ".json"),
             WFHTTPHeaders=headers,
             WFJSONValues=dictfield([("message", tstr("足跡打卡：", out(name, "提供的輸入")), 0),
                                     ("content", tstr(out(db64, "Base64 編碼的結果")), 0),
                                     ("branch", BRANCH, 0)])))
A.append(act("is.workflow.actions.notification", WFNotificationActionTitle="足跡打卡完成",
             WFNotificationActionBody=tstr(out(name, "提供的輸入"), " 已送出，大約 3 分鐘後出現在足跡地圖")))

wf = {
    "WFWorkflowClientVersion": "2605.0.5",
    "WFWorkflowMinimumClientVersion": 900,
    "WFWorkflowMinimumClientVersionString": "900",
    "WFWorkflowIcon": {"WFWorkflowIconStartColor": 4282601983, "WFWorkflowIconGlyphNumber": 59511},
    "WFWorkflowTypes": [],
    "WFWorkflowInputContentItemClasses": ["WFImageContentItem"],
    "WFWorkflowOutputContentItemClasses": [],
    "WFWorkflowHasShortcutInputVariables": False,
    "WFWorkflowImportQuestions": [{
        "ActionIndex": 0, "Category": "Parameter", "ParameterKey": "WFTextActionText", "DefaultValue": "",
        "Text": "貼上 GitHub token（只限 wilson-webpage 的 Contents 讀寫權限，只會存在這支 iPhone 的捷徑裡）",
    }],
    "WFWorkflowActions": A,
}
with open("足跡打卡.unsigned.shortcut", "wb") as f:
    plistlib.dump(wf, f, fmt=plistlib.FMT_BINARY)
print("actions:", len(A))
