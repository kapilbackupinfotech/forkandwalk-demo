(function() {
    function lerp(current, target, speed = .1, limit = .001) {
        let change = (target - current) * speed;
        return Math.abs(change) < limit && (change = target - current), change
    }
    class FoldedDom {
        constructor(wrapper, folds = null) {
            this.wrapper = wrapper, this.folds = folds, this.centerHeight = 0
        }
        createFold(side = "center", index = 0) {
            const fold = document.createElement("div");
            switch (fold.classList.add("fold"), side) { 
                case "before":
                    fold.classList.add("fold-before"), fold.classList.add("fold-before-" + index);
                    break;
                case "after":
                    fold.classList.add("fold-after"), fold.classList.add("fold-after-" + index);
                    break;
                default:
                    fold.classList.add("fold-middle");
                    break
            }
            const content2 = this.baseContent.cloneNode(!0);
            content2.classList.remove("base-content"), content2.id = "";
            const scroller = document.createElement("div");
            return scroller.classList.add("fold-scroller"), scroller.append(content2), fold.append(scroller), fold
        }
        generateSide(baseContent, foldCount, side) {
            const centerFold = this.createFold(0, 0),
                beforeFolds = [],
                afterFolds = [];
            for (let i = 0; i < foldCount; i++) beforeFolds.push(this.createFold("before", i + 1)), afterFolds.push(this.createFold("after", i + 1));
            let folds = beforeFolds.reverse().concat(centerFold).concat(afterFolds);
            const foldedDomEle = document.createElement("div");
            return foldedDomEle.classList.add("wrapper-3d"), foldedDomEle.classList.add("side-" + side), folds.forEach(fold => {
                foldedDomEle.append(fold)
            }), this.wrapper.append(foldedDomEle), {
                folds,
                wrapper: foldedDomEle
            }
        }
        generateFolds(baseContent, foldCount) {
            this.baseContent = baseContent;
            const leftFolds = this.generateSide(baseContent, 1, "left"),
                rightFolds = this.generateSide(baseContent, 1, "right");
            this.centerFold = rightFolds.folds[Math.floor(leftFolds.folds.length / 2)], this.leftFolds = leftFolds, this.rightFolds = rightFolds
        }
        updateStyles(progress) {
            let leftFolds = this.leftFolds.folds,
                rightFolds = this.rightFolds.folds,
                center = Math.floor(leftFolds.length / 2),
                scroll = center * -100;
            for (let i = 0; i < leftFolds.length; i++) {
                let foldLeft = leftFolds[i],
                    foldRight = rightFolds[i];
                const centerRelativeIndex = i - center;
                let percentage = `${scroll-centerRelativeIndex*100+100}%`,
                    pixels = 0,
                    translateY = percentage;
                centerRelativeIndex > 0 && (pixels += -this.centerFold.offsetHeight, translateY = `${pixels}px`), foldLeft.children[0].style.transform = `translateY(${translateY})`, foldLeft.children[0].children[0].style.transform = `translateY(${progress}px)`, foldRight.children[0].style.transform = `translate(-50%, ${translateY})`, foldRight.children[0].children[0].style.transform = `translateY(${progress}px)`
            }
        }
    }
    Promise.all(Array.from(document.querySelectorAll(".content__img")).map(img => new Promise(resolve => {
        resolve()
    }))).then(() => {
		
		
        document.body.classList.remove("loading"), Array.from(document.querySelectorAll(".splash, .split")).forEach(splash => {
            const baseContent = splash.querySelector(".base-content"),
                foldWrapper = splash.querySelector(".fold-wrapper"),
                btn = splash.querySelector(".btn-debug");
            console.log({
                baseContent
            });
            const toggleDebug = () => {
                splash.classList.toggle("debug")
            };
            btn.addEventListener("click", toggleDebug);
            let state = {
                    scroll: 0,
                    targetScroll: 0,
                    progress: 0,
                    targetProgress: 0,
                    disposed: !1
                },
                foldedDomCenter, tick = () => {
                    if (state.disposed) return;
                    splash.style.height = foldedDomCenter.centerFold.children[0].children[0].clientHeight + -foldedDomCenter.centerFold.clientHeight + window.innerHeight + "px", state.targetScroll = -(document.documentElement.scrollTop || document.body.scrollTop), state.scroll += lerp(state.scroll, state.targetScroll, .1, 1e-4);
                    let progress = state.scroll,
                        offsetTop = splash.offsetTop;
                    foldedDomCenter.updateStyles(progress + offsetTop), requestAnimationFrame(tick)
                };
            foldedDomCenter = new FoldedDom(foldWrapper), foldedDomCenter.generateFolds(baseContent, 1), tick()
        })
    })
})();