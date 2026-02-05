"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAnimationPerformance = exports.useTimeline = exports.useSpringAnimation = exports.useGestureAnimation = exports.useMorphAnimation = exports.useMagneticEffect = exports.useParallax = exports.useRippleEffect = exports.useParticleAnimation = exports.useTypingAnimation = exports.useLoadingAnimation = exports.useHoverAnimation = exports.useStaggeredAnimation = exports.useIntersectionObserver = void 0;
// Animation Hooks for React Components - Micro-interactions & Polish
const react_1 = require("react");
// Intersection Observer Hook for scroll-triggered animations
const useIntersectionObserver = (options = {}) => {
    const [isIntersecting, setIsIntersecting] = (0, react_1.useState)(false);
    const [hasIntersected, setHasIntersected] = (0, react_1.useState)(false);
    const ref = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        const element = ref.current;
        if (!element)
            return;
        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting);
            if (entry.isIntersecting && !hasIntersected) {
                setHasIntersected(true);
            }
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
            ...options
        });
        observer.observe(element);
        return () => {
            observer.unobserve(element);
        };
    }, [options.threshold, options.rootMargin, hasIntersected]);
    return { ref, isIntersecting, hasIntersected };
};
exports.useIntersectionObserver = useIntersectionObserver;
// Staggered animation hook for lists
const useStaggeredAnimation = (itemCount, delay = 100) => {
    const [visibleItems, setVisibleItems] = (0, react_1.useState)(new Set());
    const showItem = (0, react_1.useCallback)((index) => {
        setVisibleItems(prev => new Set(prev).add(index));
    }, []);
    const showAllItems = (0, react_1.useCallback)(() => {
        for (let i = 0; i < itemCount; i++) {
            setTimeout(() => {
                setVisibleItems(prev => new Set(prev).add(i));
            }, i * delay);
        }
    }, [itemCount, delay]);
    const hideItem = (0, react_1.useCallback)((index) => {
        setVisibleItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(index);
            return newSet;
        });
    }, []);
    const hideAllItems = (0, react_1.useCallback)(() => {
        setVisibleItems(new Set());
    }, []);
    return {
        visibleItems,
        showItem,
        hideItem,
        showAllItems,
        hideAllItems
    };
};
exports.useStaggeredAnimation = useStaggeredAnimation;
// Hover animation hook with spring physics
const useHoverAnimation = () => {
    const [isHovered, setIsHovered] = (0, react_1.useState)(false);
    const [scale, setScale] = (0, react_1.useState)(1);
    const [rotate, setRotate] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => {
        if (isHovered) {
            setScale(1.05);
            setRotate(2);
        }
        else {
            setScale(1);
            setRotate(0);
        }
    }, [isHovered]);
    const handleMouseEnter = (0, react_1.useCallback)(() => {
        setIsHovered(true);
    }, []);
    const handleMouseLeave = (0, react_1.useCallback)(() => {
        setIsHovered(false);
    }, []);
    return {
        isHovered,
        scale,
        rotate,
        handlers: {
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave
        }
    };
};
exports.useHoverAnimation = useHoverAnimation;
// Loading animation hook
const useLoadingAnimation = (duration = 2000) => {
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [progress, setProgress] = (0, react_1.useState)(0);
    const startLoading = (0, react_1.useCallback)(() => {
        setIsLoading(true);
        setProgress(0);
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsLoading(false);
                    return 100;
                }
                return prev + (100 / (duration / 100));
            });
        }, 100);
        return () => clearInterval(interval);
    }, [duration]);
    const stopLoading = (0, react_1.useCallback)(() => {
        setIsLoading(false);
        setProgress(100);
    }, []);
    return {
        isLoading,
        progress,
        startLoading,
        stopLoading
    };
};
exports.useLoadingAnimation = useLoadingAnimation;
// Typing animation hook
const useTypingAnimation = (text, speed = 50, delay = 0) => {
    const [displayedText, setDisplayedText] = (0, react_1.useState)('');
    const [isTyping, setIsTyping] = (0, react_1.useState)(false);
    const [isComplete, setIsComplete] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        setDisplayedText('');
        setIsTyping(false);
        setIsComplete(false);
        const timeout = setTimeout(() => {
            setIsTyping(true);
            let currentIndex = 0;
            const interval = setInterval(() => {
                if (currentIndex < text.length) {
                    setDisplayedText(text.slice(0, currentIndex + 1));
                    currentIndex++;
                }
                else {
                    setIsTyping(false);
                    setIsComplete(true);
                    clearInterval(interval);
                }
            }, speed);
            return () => clearInterval(interval);
        }, delay);
        return () => clearTimeout(timeout);
    }, [text, speed, delay]);
    return {
        displayedText,
        isTyping,
        isComplete
    };
};
exports.useTypingAnimation = useTypingAnimation;
// Particle animation hook
const useParticleAnimation = (particleCount = 20) => {
    const [particles, setParticles] = (0, react_1.useState)([]);
    const generateParticles = (0, react_1.useCallback)((x, y) => {
        const newParticles = Array.from({ length: particleCount }, (_, i) => ({
            id: Date.now() + i,
            x,
            y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            size: Math.random() * 4 + 2,
            opacity: 1
        }));
        setParticles(newParticles);
        // Animate particles
        const interval = setInterval(() => {
            setParticles(prev => prev.map(particle => ({
                ...particle,
                x: particle.x + particle.vx,
                y: particle.y + particle.vy,
                vy: particle.vy + 0.1, // gravity
                opacity: Math.max(0, particle.opacity - 0.02)
            })).filter(particle => particle.opacity > 0));
        }, 16);
        setTimeout(() => clearInterval(interval), 2000);
    }, [particleCount]);
    return {
        particles,
        generateParticles
    };
};
exports.useParticleAnimation = useParticleAnimation;
// Ripple effect hook
const useRippleEffect = () => {
    const [ripples, setRipples] = (0, react_1.useState)([]);
    const createRipple = (0, react_1.useCallback)((event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const size = Math.max(rect.width, rect.height);
        const newRipple = {
            id: Date.now(),
            x,
            y,
            size
        };
        setRipples(prev => [...prev, newRipple]);
        setTimeout(() => {
            setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
        }, 600);
    }, []);
    return {
        ripples,
        createRipple
    };
};
exports.useRippleEffect = useRippleEffect;
// Parallax scroll hook
const useParallax = (speed = 0.5) => {
    const [offset, setOffset] = (0, react_1.useState)(0);
    const ref = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        const handleScroll = () => {
            if (ref.current) {
                const scrolled = window.scrollY;
                const rate = scrolled * -speed;
                setOffset(rate);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [speed]);
    return {
        ref,
        offset,
        transform: `translateY(${offset}px)`
    };
};
exports.useParallax = useParallax;
// Magnetic effect hook
const useMagneticEffect = (strength = 0.3) => {
    const [position, setPosition] = (0, react_1.useState)({ x: 0, y: 0 });
    const ref = (0, react_1.useRef)(null);
    const handleMouseMove = (0, react_1.useCallback)((event) => {
        if (!ref.current)
            return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (event.clientX - centerX) * strength;
        const deltaY = (event.clientY - centerY) * strength;
        setPosition({ x: deltaX, y: deltaY });
    }, [strength]);
    const handleMouseLeave = (0, react_1.useCallback)(() => {
        setPosition({ x: 0, y: 0 });
    }, []);
    return {
        ref,
        position,
        handlers: {
            onMouseMove: handleMouseMove,
            onMouseLeave: handleMouseLeave
        },
        transform: `translate(${position.x}px, ${position.y}px)`
    };
};
exports.useMagneticEffect = useMagneticEffect;
// Morph animation hook
const useMorphAnimation = (shapes, duration = 2000) => {
    const [currentShapeIndex, setCurrentShapeIndex] = (0, react_1.useState)(0);
    const [isAnimating, setIsAnimating] = (0, react_1.useState)(false);
    const morphToShape = (0, react_1.useCallback)((index) => {
        if (index === currentShapeIndex || isAnimating)
            return;
        setIsAnimating(true);
        setCurrentShapeIndex(index);
        setTimeout(() => {
            setIsAnimating(false);
        }, duration);
    }, [currentShapeIndex, isAnimating, duration]);
    const nextShape = (0, react_1.useCallback)(() => {
        const nextIndex = (currentShapeIndex + 1) % shapes.length;
        morphToShape(nextIndex);
    }, [currentShapeIndex, shapes.length, morphToShape]);
    const prevShape = (0, react_1.useCallback)(() => {
        const prevIndex = currentShapeIndex === 0 ? shapes.length - 1 : currentShapeIndex - 1;
        morphToShape(prevIndex);
    }, [currentShapeIndex, shapes.length, morphToShape]);
    (0, react_1.useEffect)(() => {
        const interval = setInterval(nextShape, duration * 2);
        return () => clearInterval(interval);
    }, [nextShape, duration]);
    return {
        currentShape: shapes[currentShapeIndex],
        currentShapeIndex,
        isAnimating,
        morphToShape,
        nextShape,
        prevShape
    };
};
exports.useMorphAnimation = useMorphAnimation;
// Gesture animation hook
const useGestureAnimation = () => {
    const [gesture, setGesture] = (0, react_1.useState)({ type: null });
    const [startPoint, setStartPoint] = (0, react_1.useState)({ x: 0, y: 0 });
    const [currentPoint, setCurrentPoint] = (0, react_1.useState)({ x: 0, y: 0 });
    const handleTouchStart = (0, react_1.useCallback)((event) => {
        const touch = event.touches[0];
        setStartPoint({ x: touch.clientX, y: touch.clientY });
        setCurrentPoint({ x: touch.clientX, y: touch.clientY });
    }, []);
    const handleTouchMove = (0, react_1.useCallback)((event) => {
        const touch = event.touches[0];
        setCurrentPoint({ x: touch.clientX, y: touch.clientY });
    }, []);
    const handleTouchEnd = (0, react_1.useCallback)(() => {
        const deltaX = currentPoint.x - startPoint.x;
        const deltaY = currentPoint.y - startPoint.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (distance > 50) {
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                setGesture({
                    type: 'swipe',
                    direction: deltaX > 0 ? 'right' : 'left'
                });
            }
            else {
                setGesture({
                    type: 'swipe',
                    direction: deltaY > 0 ? 'down' : 'up'
                });
            }
            setTimeout(() => setGesture({ type: null }), 300);
        }
    }, [currentPoint, startPoint]);
    return {
        gesture,
        startPoint,
        currentPoint,
        handlers: {
            onTouchStart: handleTouchStart,
            onTouchMove: handleTouchMove,
            onTouchEnd: handleTouchEnd
        }
    };
};
exports.useGestureAnimation = useGestureAnimation;
// Spring animation hook
const useSpringAnimation = (to, config = { tension: 300, friction: 20 }) => {
    const [value, setValue] = (0, react_1.useState)(0);
    const [velocity, setVelocity] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => {
        let animationId;
        let currentValue = value;
        let currentVelocity = velocity;
        const animate = () => {
            const displacement = to - currentValue;
            const springForce = displacement * config.tension;
            const dampingForce = currentVelocity * config.friction;
            const acceleration = springForce - dampingForce;
            currentVelocity += acceleration * 0.016; // 60fps
            currentValue += currentVelocity * 0.016;
            setValue(currentValue);
            setVelocity(currentVelocity);
            if (Math.abs(displacement) > 0.01 || Math.abs(currentVelocity) > 0.01) {
                animationId = requestAnimationFrame(animate);
            }
        };
        animate();
        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, [to, config.tension, config.friction]);
    return value;
};
exports.useSpringAnimation = useSpringAnimation;
// Timeline animation hook
const useTimeline = () => {
    const [currentTime, setCurrentTime] = (0, react_1.useState)(0);
    const [isPlaying, setIsPlaying] = (0, react_1.useState)(false);
    const [duration, setDuration] = (0, react_1.useState)(1000);
    const animations = (0, react_1.useRef)([]);
    const addAnimation = (0, react_1.useCallback)((start, duration, callback) => {
        animations.current.push({ start, duration, callback });
    }, []);
    const play = (0, react_1.useCallback)(() => {
        setIsPlaying(true);
        setCurrentTime(0);
        const startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            setCurrentTime(elapsed);
            animations.current.forEach(animation => {
                if (elapsed >= animation.start) {
                    const animProgress = Math.min((elapsed - animation.start) / animation.duration, 1);
                    animation.callback(animProgress);
                }
            });
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
            else {
                setIsPlaying(false);
            }
        };
        requestAnimationFrame(animate);
    }, [duration]);
    const pause = (0, react_1.useCallback)(() => {
        setIsPlaying(false);
    }, []);
    const reset = (0, react_1.useCallback)(() => {
        setCurrentTime(0);
        setIsPlaying(false);
    }, []);
    return {
        currentTime,
        isPlaying,
        duration,
        addAnimation,
        play,
        pause,
        reset,
        setDuration
    };
};
exports.useTimeline = useTimeline;
// Performance monitoring hook
const useAnimationPerformance = () => {
    const [fps, setFps] = (0, react_1.useState)(60);
    const [frameTime, setFrameTime] = (0, react_1.useState)(16.67);
    const frameCount = (0, react_1.useRef)(0);
    const lastTime = (0, react_1.useRef)(performance.now());
    (0, react_1.useEffect)(() => {
        let animationId;
        const measurePerformance = () => {
            frameCount.current++;
            const currentTime = performance.now();
            const deltaTime = currentTime - lastTime.current;
            if (deltaTime >= 1000) {
                const currentFps = (frameCount.current * 1000) / deltaTime;
                const currentFrameTime = deltaTime / frameCount.current;
                setFps(Math.round(currentFps));
                setFrameTime(currentFrameTime);
                frameCount.current = 0;
                lastTime.current = currentTime;
            }
            animationId = requestAnimationFrame(measurePerformance);
        };
        animationId = requestAnimationFrame(measurePerformance);
        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, []);
    return {
        fps,
        frameTime,
        isOptimal: fps >= 55 && frameTime <= 18
    };
};
exports.useAnimationPerformance = useAnimationPerformance;
exports.default = {
    useIntersectionObserver: exports.useIntersectionObserver,
    useStaggeredAnimation: exports.useStaggeredAnimation,
    useHoverAnimation: exports.useHoverAnimation,
    useLoadingAnimation: exports.useLoadingAnimation,
    useTypingAnimation: exports.useTypingAnimation,
    useParticleAnimation: exports.useParticleAnimation,
    useRippleEffect: exports.useRippleEffect,
    useParallax: exports.useParallax,
    useMagneticEffect: exports.useMagneticEffect,
    useMorphAnimation: exports.useMorphAnimation,
    useGestureAnimation: exports.useGestureAnimation,
    useSpringAnimation: exports.useSpringAnimation,
    useTimeline: exports.useTimeline,
    useAnimationPerformance: exports.useAnimationPerformance
};
