import { ICellRendererComp, ICellRendererParams } from 'ag-grid-community';

export interface GroupFlagCellRendererParams extends ICellRendererParams {
    flagCodes: Record<string, string>;
}

export class GroupRowInnerRenderer implements ICellRendererComp {
    eGui!: HTMLElement;
    params!: GroupFlagCellRendererParams;
    public toggle = true;
    dataChangedListener!: () => void;

    init(params: GroupFlagCellRendererParams) {
        this.eGui = document.createElement('div');
        this.eGui.style.display = 'inline-block';
        this.params = params;
        this.refreshGui();
        this.dataChangedListener = () => {
            this.params.node.setExpanded(!this.params.node.expanded);
            this.refreshGui();
        };

        this.eGui.addEventListener('click', this.dataChangedListener);
    }

    refreshGui() {
        this.toggle = this.params.node.expanded;
        let value = this.getStatusName(this.params.value);
        let name = value.name;
        let className = value.className;
        let count = this.params.node.allChildrenCount;
        var html = `
    <div class="grouped-status-row w-100">
      <div class="d-flex align-items-center justify-content-between w-100">
        <div class="d-flex align-items-center left-sticky-label">
            <div class="ellipsis">` + name + `</div>` +
            `<div class="count m-l-5 ` + className + `">
                <div class="count-value">`+ count + `</div>
            </div>
        </div>
      </div>
      <div class=${!this.toggle ? 'toggle-icon-open' : 'toggle-icon-close'} style="float:right;position:sticky;right:15px"></div>
    </div>
    `;


        this.eGui.innerHTML = html;
    }
    getStatusName(id) {
        let name;
        let className;

        switch (id) {
            case 'Open':
            case 'Inquired': { name = 'Offers'; className = "offers"; break; }
            case 'AwaitingApproval': { name = 'Awaiting Approval'; className = "await"; break; }
            case 'Approved': { name = 'Approved'; className = "approved"; break; }
            case 'Rejected': { name = 'Rejected'; className = "rejected"; break; }
            case 'Contracted': { name = 'Contracted'; className = "contracted"; break; }
        }
        return {
            "name": name,
            "className": className
        };
    }
    destroy() {
        this.params.api.removeEventListener(
            'cellValueChanged',
            this.dataChangedListener
        );
    }

    getGui() {
        return this.eGui;
    }

    refresh(params: ICellRendererParams): boolean {
        return false;
    }
}
