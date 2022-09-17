window.addEventListener('DOMContentLoaded', () => {

    // Add images from DB
    class PhotoItem {
        constructor(src, parentSelector) {
            this.src = src;
            this.parent = document.querySelector(parentSelector);
        }

        render() {
            let div = document.createElement('div');
            div.innerHTML = `
            <div class="slider__item">
                            <img src=${this.src}>
                        </div>`;
            this.parent.append(div);
        }
    }

    let arr = [];

    fetch('http://localhost:3000/imges')
        .then(data => data.json())
        .then(data => {
            data.forEach(({img}) => {
                new PhotoItem(img, '.slider__wrapper').render();
            })
        })
        .then(() => {
            // Slider
            const slider = document.querySelector('.slider'),
                sliderWrapper = document.querySelector('.slider__wrapper'),
                slides = document.querySelectorAll('.slider__item'),
                prev = document.querySelector('.slider-prev'),
                next = document.querySelector('.slider-next'),
                total = document.querySelector('.total__number'),
                current = document.querySelector('.current__number'),
                width = window.getComputedStyle(slider).width;

            let slideIndex = 1;
            let offset = 0;

            sliderWrapper.style.width = 100 * slides.length + '%';
            sliderWrapper.style.transition = '0.5s all';

            slider.style.overflow = 'hidden';

            slides.forEach(slide => {
                slide.style.width = width;
            })

            if (slides.length < 10) {
                total.textContent = `0${slides.length}`;
                current.textContent = `0${slideIndex}`;
            } else {
                total.textContent = slides.length;
                current.textContent = slideIndex;
            }

            next.addEventListener('click', () => {
                if (offset == +width.slice(0, width.length - 2) * (slides.length - 1)) {
                    offset = 0;
                } else {
                    offset += +width.slice(0, width.length - 2);
                }
                sliderWrapper.style.transform = `translateX(-${offset}px)`;

                if (slideIndex == slides.length) {
                    slideIndex = 1;
                } else {
                    slideIndex++;
                }

                if (slides.length < 10) {
                    current.textContent = `0${slideIndex}`;
                } else {
                    current.textContent = slideIndex;
                }
            })

            prev.addEventListener('click', () => {
                if (offset == 0) {
                    offset = +width.slice(0, width.length - 2) * (slides.length - 1);
                } else {
                    offset -= +width.slice(0, width.length - 2);
                }
                sliderWrapper.style.transform = `translateX(-${offset}px)`;

                if (slideIndex == 1) {
                    slideIndex = slides.length;
                } else {
                    slideIndex--;
                }

                if (slides.length < 10) {
                    current.textContent = `0${slideIndex}`;
                } else {
                    current.textContent = slideIndex;
                }
            })
        })


})