import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";

const FlyingCartAnimation = () => {
    const [animations, setAnimations] = useState<{ id: number, x: number, y: number, targetX: number, targetY: number }[]>([]);

    useEffect(() => {
        const handleFly = (e: Event) => {
            const target = document.getElementById("cart-icon-header");
            if (!target) return;

            const { x: startX, y: startY } = (e as CustomEvent<{ x: number; y: number }>).detail;
            const targetRect = target.getBoundingClientRect();
            const targetX = targetRect.left + targetRect.width / 2;
            const targetY = targetRect.top + targetRect.height / 2;

            const id = Date.now();
            setAnimations(prev => [...prev, { id, x: startX, y: startY, targetX, targetY }]);

            setTimeout(() => {
                setAnimations(prev => prev.filter(a => a.id !== id));
            }, 800);
        };

        window.addEventListener("fly-to-cart", handleFly);
        return () => window.removeEventListener("fly-to-cart", handleFly);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            {animations.map(anim => (
                <div
                    key={anim.id}
                    className="absolute text-primary animate-fly-to-cart"
                    style={{
                        "--start-x": `${anim.x}px`,
                        "--start-y": `${anim.y}px`,
                        "--end-x": `${anim.targetX}px`,
                        "--end-y": `${anim.targetY}px`,
                    } as React.CSSProperties}
                >
                    <div className="bg-primary text-white p-2 rounded-full shadow-lg">
                        <ShoppingBag size={20} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FlyingCartAnimation;
