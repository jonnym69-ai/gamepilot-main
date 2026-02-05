"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDragAndDrop = useDragAndDrop;
exports.useDragStyles = useDragStyles;
const react_1 = require("react");
function useDragAndDrop({ items, onReorder, disabled = false }) {
    const [draggedItem, setDraggedItem] = (0, react_1.useState)(null);
    const [dragOverIndex, setDragOverIndex] = (0, react_1.useState)(null);
    const dragCounter = (0, react_1.useRef)(0);
    const handleDragStart = (0, react_1.useCallback)((e, index) => {
        if (disabled)
            return;
        const item = items[index];
        if (!item)
            return;
        setDraggedItem({ id: item.id, index });
        // Set drag data
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', JSON.stringify({ id: item.id, index }));
        // Add visual feedback
        const target = e.target;
        target.classList.add('opacity-50');
        // Set drag image (optional - creates custom drag preview)
        const dragImage = target;
        e.dataTransfer.setDragImage(dragImage, 0, 0);
    }, [items, disabled]);
    const handleDragEnd = (0, react_1.useCallback)((e) => {
        // Remove visual feedback
        const target = e.target;
        target.classList.remove('opacity-50');
        setDraggedItem(null);
        setDragOverIndex(null);
        dragCounter.current = 0;
    }, []);
    const handleDragOver = (0, react_1.useCallback)((e, index) => {
        if (disabled || !draggedItem)
            return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        // Only update if this is a different index
        if (dragOverIndex !== index) {
            setDragOverIndex(index);
        }
    }, [draggedItem, dragOverIndex, disabled]);
    const handleDragEnter = (0, react_1.useCallback)((e) => {
        if (disabled || !draggedItem)
            return;
        e.preventDefault();
        dragCounter.current++;
    }, [draggedItem, disabled]);
    const handleDragLeave = (0, react_1.useCallback)(() => {
        if (disabled || !draggedItem)
            return;
        dragCounter.current--;
        if (dragCounter.current === 0) {
            setDragOverIndex(null);
        }
    }, [draggedItem, disabled]);
    const handleDrop = (0, react_1.useCallback)((e, dropIndex) => {
        if (disabled || !draggedItem)
            return;
        e.preventDefault();
        e.stopPropagation();
        try {
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            const fromIndex = data.index;
            // Don't do anything if dropping on same position
            if (fromIndex === dropIndex)
                return;
            // Perform the reorder
            onReorder(fromIndex, dropIndex);
        }
        catch (error) {
            console.error('Failed to parse drag data:', error);
        }
        // Reset state
        setDragOverIndex(null);
        dragCounter.current = 0;
    }, [draggedItem, onReorder, disabled]);
    const isDraggedOver = (0, react_1.useCallback)((index) => {
        return dragOverIndex === index;
    }, [dragOverIndex]);
    const isDragging = (0, react_1.useCallback)((index) => {
        return draggedItem?.index === index;
    }, [draggedItem]);
    return {
        handleDragStart,
        handleDragEnd,
        handleDragOver,
        handleDragEnter,
        handleDragLeave,
        handleDrop,
        isDraggedOver,
        isDragging,
        draggedItem
    };
}
// Helper hook for drag styles
function useDragStyles(isDraggedOver, isDraggingFlag) {
    const dragStyles = {
        opacity: isDraggingFlag ? 0.5 : 1,
        transform: isDraggedOver ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.2s ease',
        cursor: isDraggingFlag ? 'grabbing' : 'grab',
        border: isDraggedOver ? '2px solid rgb(168 85 247)' : 'none',
        borderRadius: isDraggedOver ? '0.5rem' : '0',
        boxShadow: isDraggedOver ? '0 0 20px rgba(168, 85, 247, 0.3)' : 'none'
    };
    return dragStyles;
}
