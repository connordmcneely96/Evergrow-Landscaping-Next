'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface SignaturePadProps {
    onChange: (dataUrl: string | null) => void
    className?: string
}

export default function SignaturePad({ onChange, className }: SignaturePadProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const drawingRef = useRef(false)
    const hasDrawnRef = useRef(false)
    const lastPointRef = useRef<{ x: number; y: number } | null>(null)
    const [isEmpty, setIsEmpty] = useState(true)

    // Size the canvas backing store to its CSS size × devicePixelRatio so the
    // signature stays crisp on high-DPI / mobile screens.
    const setupCanvas = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ratio = window.devicePixelRatio || 1
        const rect = canvas.getBoundingClientRect()
        canvas.width = Math.round(rect.width * ratio)
        canvas.height = Math.round(rect.height * ratio)
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.scale(ratio, ratio)
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.strokeStyle = '#1F1F1F'
    }, [])

    useEffect(() => {
        setupCanvas()
        const handleResize = () => {
            // Resizing clears the backing store; reset to an empty pad.
            setupCanvas()
            hasDrawnRef.current = false
            setIsEmpty(true)
            onChange(null)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [setupCanvas, onChange])

    function getPoint(e: React.PointerEvent<HTMLCanvasElement>) {
        const canvas = canvasRef.current!
        const rect = canvas.getBoundingClientRect()
        return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
        e.preventDefault()
        const canvas = canvasRef.current
        if (!canvas) return
        canvas.setPointerCapture(e.pointerId)
        drawingRef.current = true
        lastPointRef.current = getPoint(e)
    }

    function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
        if (!drawingRef.current) return
        e.preventDefault()
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (!canvas || !ctx) return
        const point = getPoint(e)
        const last = lastPointRef.current
        if (last) {
            ctx.beginPath()
            ctx.moveTo(last.x, last.y)
            ctx.lineTo(point.x, point.y)
            ctx.stroke()
        }
        lastPointRef.current = point
        if (!hasDrawnRef.current) {
            hasDrawnRef.current = true
            setIsEmpty(false)
        }
    }

    function endStroke() {
        if (!drawingRef.current) return
        drawingRef.current = false
        lastPointRef.current = null
        const canvas = canvasRef.current
        if (canvas && hasDrawnRef.current) {
            onChange(canvas.toDataURL('image/png'))
        }
    }

    function handleClear() {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (!canvas || !ctx) return
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        hasDrawnRef.current = false
        setIsEmpty(true)
        onChange(null)
    }

    return (
        <div className={className}>
            <div className="flex items-center justify-between mb-1">
                <span className="block text-sm font-medium text-gray-700">
                    Signature
                </span>
                <button
                    type="button"
                    onClick={handleClear}
                    className="text-xs font-semibold text-forest-green hover:text-vibrant-gold transition-colors"
                >
                    Clear
                </button>
            </div>
            <canvas
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={endStroke}
                onPointerLeave={endStroke}
                onPointerCancel={endStroke}
                className="w-full h-40 rounded-lg border-2 border-forest-green/30 bg-white touch-none cursor-crosshair"
                aria-label="Signature pad — draw your signature"
            />
            {isEmpty && (
                <p className="mt-1 text-xs text-gray-400">
                    Draw your signature above using your mouse or finger.
                </p>
            )}
        </div>
    )
}
