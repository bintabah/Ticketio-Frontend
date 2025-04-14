import { Component } from '@angular/core';

@Component({
    selector: 'app-footer',
    template: `
        <footer class="footer">
            <span>© 2024 Ticketio. All rights reserved.</span>
        </footer>
    `,
    styles: [`
        .footer {
            position: fixed;
            bottom: 0;
            left: 250px; /* Width of sidebar */
            right: 0;
            height: 3rem;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #ffffff;
            border-top: 1px solid #e2e8f0;
            color: #64748b;
            font-size: 0.75rem;
            user-select: none;
            z-index: 900;
            margin: 0;
            padding: 0;
            box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.05);
        }
    `],
    standalone: true
})
export class FooterComponent {} 