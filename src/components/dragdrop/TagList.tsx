import CloseButton from "@mui/icons-material/Close";
import Checkbox from "@mui/material/Checkbox";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { UpdateToDoField } from "@type/todo";

export interface Tag {
  id: number;
  name: string;
}

const SortableTag = ({ handleSelectedTags, tag, onDelete, errored, selected, setFieldValue, selectedTags }: { handleSelectedTags: (tag: Tag) => void, tag: Tag; onDelete: (id: number) => void, errored: boolean, selected: boolean, setFieldValue: UpdateToDoField, selectedTags: Tag[]}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: tag.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '8px',
    margin: '4px',
    borderColor: errored ? "red" : "#fff",
    border: "1px solid",
    borderRadius: '8px',
    cursor: 'grab',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minWidth: '100px'
  };

  const closeButtonStyle = {
    transition: 'color 0.2s ease',
    cursor: 'pointer',
    ':hover': {
      color: 'red'
    }
  };


  return (
    <div onClick={() => { handleSelectedTags(tag); setFieldValue("tags", [...selectedTags.map(e => e.name), tag.name])}} ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Checkbox checked={selected} onClick={() => false}
      
      sx={{
        "&:checked": {
            transition: "opacity 0.2s",
            opacity: 1,
        }
      }}
      
      />
      <div>{tag.name}</div>
      <div style={{ marginLeft: '8px' }}>
        <CloseButton sx={closeButtonStyle} onClick={() => onDelete(tag.id)} />
      </div>
    </div>
  );
};

const TagList = ({tags, setTags, erroredTag, selectedTags, handleSelectedTags, setFieldValue}: {tags: Tag[], setTags: (tags: Tag[]) => void, erroredTag: Tag | null, selectedTags: Tag[], handleSelectedTags: (tag: Tag) => void, setFieldValue: UpdateToDoField}) => {

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Optional: sorgt dafür, dass nach 5px Ziehen das Dragging aktiviert wird
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
        const result = arrayMove(tags, tags.findIndex((tag) => tag.id === active.id), tags.findIndex((tag) => tag.id === over?.id));
        setTags(result);
    }
  };

  const handleDelete = (id: number) => {
    setTags(tags.filter(tag => tag.id !== id));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={tags} strategy={verticalListSortingStrategy}>
        {tags.map((tag) => (
          <SortableTag selectedTags={selectedTags} handleSelectedTags={handleSelectedTags} setFieldValue={setFieldValue} errored={tag.id === erroredTag?.id} selected={selectedTags.find(i => i.id === tag.id)?.id ? true : false} key={tag.id} tag={tag} onDelete={handleDelete} />
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default TagList;
