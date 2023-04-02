"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewableLine = void 0;
class ViewableLine {
    constructor(editType, oldLine, newLine) {
        this.EditType = editType;
        this.OldLine = oldLine;
        this.NewLine = newLine;
    }
    getOldLineNumber() {
        if (this.OldLine?.LineIndex == null) {
            return "";
        }
        return this.OldLine.LineIndex.toString();
    }
    getNewLineNumber() {
        if (this.NewLine?.LineIndex == null) {
            return "";
        }
        return this.NewLine.LineIndex.toString();
    }
    getlineText() {
        if (this.NewLine == null && this.OldLine != null) {
            return this.OldLine?.LineValue;
        }
        else if (this.OldLine == null && this.NewLine != null) {
            return this.NewLine?.LineValue;
        }
        else if (this.OldLine?.LineValue == this.NewLine?.LineValue && this.OldLine?.LineValue != null) {
            return this.OldLine?.LineValue;
        }
        return "";
    }
    getLineColor() {
        return this.EditType === "deleted" ? "deleted" : this.EditType === "inserted" ? "added" : "equals";
    }
}
exports.ViewableLine = ViewableLine;
//# sourceMappingURL=viewable-line.model.js.map