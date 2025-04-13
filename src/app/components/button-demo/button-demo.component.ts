import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-button-demo',
    standalone: true,
    imports: [ButtonModule],
    template: `
        <div class="flex flex-column gap-4">
            <div class="flex flex-column gap-2">
                <h3 class="text-xl m-0 mb-2">Basic Buttons</h3>
                <div class="flex gap-2 flex-wrap">
                    <p-button label="Primary" severity="primary"></p-button>
                    <p-button label="Secondary" severity="secondary"></p-button>
                    <p-button label="Success" severity="success"></p-button>
                    <p-button label="Info" severity="info"></p-button>
                    <p-button label="Warning" severity="warn"></p-button>
                    <p-button label="Help" severity="help"></p-button>
                    <p-button label="Danger" severity="danger"></p-button>
                </div>
            </div>

            <div class="flex flex-column gap-2">
                <h3 class="text-xl m-0 mb-2">Button Styles</h3>
                <div class="flex gap-2 flex-wrap">
                    <p-button label="Raised" raised severity="primary"></p-button>
                    <p-button label="Rounded" rounded severity="secondary"></p-button>
                    <p-button label="Text" text severity="success"></p-button>
                    <p-button label="Outlined" outlined severity="info"></p-button>
                </div>
            </div>

            <div class="flex flex-column gap-2">
                <h3 class="text-xl m-0 mb-2">Icon Buttons</h3>
                <div class="flex gap-2 flex-wrap">
                    <p-button icon="pi pi-check" severity="success"></p-button>
                    <p-button icon="pi pi-bookmark" severity="secondary" rounded></p-button>
                    <p-button icon="pi pi-search" severity="info" outlined></p-button>
                    <p-button label="Bookmark" icon="pi pi-bookmark-fill" severity="warn"></p-button>
                    <p-button label="Delete" icon="pi pi-trash" severity="danger" outlined></p-button>
                </div>
            </div>
        </div>
    `
})
export class ButtonDemoComponent {} 