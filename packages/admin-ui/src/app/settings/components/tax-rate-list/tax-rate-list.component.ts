import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { BaseListComponent } from '../../../common/base-list.component';
import { DeletionResult, GetTaxRateList } from '../../../common/generated-types';
import { _ } from '../../../core/providers/i18n/mark-for-extraction';
import { NotificationService } from '../../../core/providers/notification/notification.service';
import { DataService } from '../../../data/providers/data.service';
import { ModalService } from '../../../shared/providers/modal/modal.service';

@Component({
    selector: 'vdr-tax-rate-list',
    templateUrl: './tax-rate-list.component.html',
    styleUrls: ['./tax-rate-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaxRateListComponent extends BaseListComponent<GetTaxRateList.Query, GetTaxRateList.Items> {
    constructor(
        private modalService: ModalService,
        private notificationService: NotificationService,
        private dataService: DataService,
        router: Router,
        route: ActivatedRoute,
    ) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) => this.dataService.settings.getTaxRates(...args),
            data => data.taxRates,
        );
    }

    deleteTaxRate(taxRate: GetTaxRateList.Items) {
        return this.modalService
            .dialog({
                title: _('settings.confirm-delete-tax-rate'),
                body: taxRate.name,
                buttons: [
                    { type: 'secondary', label: _('common.cancel') },
                    { type: 'danger', label: _('common.delete'), returnValue: true },
                ],
            })
            .pipe(
                switchMap(res => (res ? this.dataService.settings.deleteTaxRate(taxRate.id) : EMPTY)),
                map(res => res.deleteTaxRate),
            )
            .subscribe(
                res => {
                    if (res.result === DeletionResult.DELETED) {
                        this.notificationService.success(_('common.notify-delete-success'), {
                            entity: 'TaxRate',
                        });
                        this.refresh();
                    } else {
                        this.notificationService.error(res.message || _('common.notify-delete-error'), {
                            entity: 'TaxRate',
                        });
                    }
                },
                err => {
                    this.notificationService.error(_('common.notify-delete-error'), {
                        entity: 'TaxRate',
                    });
                },
            );
    }
}
