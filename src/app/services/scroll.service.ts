import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

export const topMargin = 16;

/**
 * A service that scrolls document elements into view
 */
@Injectable()
export class ScrollService {

    // @ts-ignore
    private _topOffset: number | null;
    // @ts-ignore
    private _topOfPageElement: Element;

    // Offset from the top of the document to bottom of any static elements
    // at the top (e.g. toolbar) + some margin
    get topOffset() {
        if (!this._topOffset && isPlatformBrowser(this.platformId)) {
            const toolbar = this.document.querySelector('app-header');
            this._topOffset = (toolbar && toolbar.clientHeight || 0) + topMargin;
        }
        return this._topOffset;
    }

    get topOfPageElement() {
        if (!this._topOfPageElement && isPlatformBrowser(this.platformId)) {
            this._topOfPageElement = this.document.getElementById('top-of-page') || this.document.body;
        }
        return this._topOfPageElement;
    }

    constructor(@Inject(DOCUMENT) private document: any,
                @Inject(PLATFORM_ID) private platformId: Object) {
    }

    /**
     * Scroll to the element.
     * Don't scroll if no element.
     */
    scrollToElement(element: Element) {
        if (element) {
            element.scrollIntoView();

            if (window && window.scrollBy) {
                // Scroll as much as necessary to align the top of `element` at `topOffset`.
                // (Usually, `.top` will be 0, except for cases where the element cannot be scrolled all the
                //  way to the top, because the viewport is larger than the height of the content after the
                //  element.)
                window.scrollBy(0, element.getBoundingClientRect().top - this.topOffset);

                // If we are very close to the top (<20px), then scroll all the way up.
                // (This can happen if `element` is at the top of the page, but has a small top-margin.)
                if (window.pageYOffset < 20) {
                    window.scrollBy(0, -window.pageYOffset);
                }
            }
        }
    }

    /** Scroll to the top of the document. */
    scrollToTop() {
        if (isPlatformBrowser(this.platformId)) {
            this.scrollToElement(this.topOfPageElement);
        }
    }
}
