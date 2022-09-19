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
                width = window.getComputedStyle(slider).width,
                sliderWindow = document.querySelector('.slider__window');

            let slideIndex = 1;
            let offset = 0;

            sliderWrapper.style.width = 100 * slides.length + '%';
            sliderWrapper.style.transition = '0.5s all';

            slider.style.overflow = 'hidden';

            slides.forEach(slide => {
                slide.style.width = width;
            })

            sliderWindow.style.position = 'relative';
            const indicators = document.createElement('ol'),
                dots = [];
            indicators.classList.add('carousel-indicators');
            slider.append(indicators);

            for(let i = 0; i < slides.length; i++){
                const dot = document.createElement('li');
                dot.classList.add('dot');
                dot.setAttribute('data-slide-to', i + 1);

                if (i == 0){
                    dot.style.opacity = 1;
                }
                indicators.append(dot);
                dots.push(dot);
            }

            if (slides.length < 10) {
                total.textContent = `0${slides.length}`;
            } else {
                total.textContent = slides.length;
            }

            function addZero () {
                if (slides.length < 10) {
                    current.textContent = `0${slideIndex}`;
                } else {
                    current.textContent = slideIndex;
                }
            }

            addZero ();

            function moveSlide () {
                sliderWrapper.style.transform = `translateX(-${offset}px)`;
            }

            function setActiveDot () {
                dots.forEach(dot => dot.style.opacity = '.5');
                dots[slideIndex - 1].style.opacity = 1;
            }

            function changeSlides () {
                moveSlide ();
                addZero ();
                setActiveDot ();
            }

            function transfToDigit (str) {
                return +str.replace(/\D/g, '');
            }


            next.addEventListener('click', () => {
                if (offset == transfToDigit(width) * (slides.length - 1)) {
                    offset = 0;
                } else {
                    offset += transfToDigit(width);
                }
                
                if (slideIndex == slides.length) {
                    slideIndex = 1;
                } else {
                    slideIndex++;
                }
                changeSlides ();               
            })

            prev.addEventListener('click', () => {
                if (offset == 0) {
                    offset = transfToDigit(width) * (slides.length - 1);
                } else {
                    offset -= transfToDigit(width);
                }
               
                if (slideIndex == 1) {
                    slideIndex = slides.length;
                } else {
                    slideIndex--;
                }
                changeSlides (); 
            })

            dots.forEach(dot => {
                dot.addEventListener('click', (e) => {
                    const slideTo = e.target.getAttribute('data-slide-to');
        
                    slideIndex = slideTo;
                    offset = transfToDigit(width) * (slideTo - 1);
                    
                    changeSlides (); 
                });
            })
        })


})