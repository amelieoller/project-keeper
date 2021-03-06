import React, { useState, useContext } from 'react';
import styled from 'styled-components';

import { firestore } from '../../firebase';
import { UserContext } from '../../providers/UserProvider';
import { ReactComponent as X } from '../../assets/icons/x.svg';
import Button from '../../atoms/Button';
import Input from '../../atoms/Input';
import Checkbox from '../../atoms/Checkbox';

const StyledTags = styled.div`
  .tag-wrapper {
    display: inline-block;

    .delete-tag {
      width: 9px;
      position: relative;
      cursor: pointer;
      display: inline-block;

      svg {
        display: none;
        position: absolute;
        left: -10px;
        bottom: -5px;
        color: ${({ theme }) => theme.lightGrey};
      }

      &:hover svg {
        color: ${({ theme }) => theme.primaryBackground};
      }
    }

    &:hover .delete-tag svg {
      display: inline-block;
    }
  }

  .new-tag-form {
    display: grid;
    align-items: flex-end;
    grid-template-columns: 2fr 1fr;

    .new-tag-form-group {
      margin-right: 1.5rem;
      margin-bottom: 0;
    }

    button {
      font-size: 1.3rem;
      white-space: nowrap;
      padding: 0.7rem 1.4rem;
      text-align: center;
      display: inline-block;
    }
  }
`;

const Tags = ({ project, setProject, user }) => {
  const { tags } = useContext(UserContext);
  const [newTag, setNewTag] = useState('');

  const handleTagSelect = tag => {
    let newTags;

    if (project.tags.map(tag => tag.name).includes(tag.name)) {
      const index = project.tags.map(tag => tag.name).indexOf(tag.name);
      if (index !== -1) {
        newTags = project.tags.filter(t => t.name !== tag.name);
      }
    } else {
      newTags = [...project.tags, tag];
    }

    setProject({
      ...project,
      tags: newTags,
    });
  };

  const handleTagCreation = () => {
    if (newTag !== '') {
      firestore
        .collection(`users/${user.uid}/tags`)
        .add({ name: newTag, count: 0 })
        .then(tagRef => {
          handleTagSelect({ name: newTag, id: tagRef.id });
        })
        .catch(error => {
          console.error('Error adding document: ', error);
        });
      setNewTag('');
    }
  };

  const handleDeleteTag = tagId => {
    firestore.doc(`users/${user.uid}/tags/${tagId}`).delete();
  };

  return (
    <StyledTags>
      {tags && tags.length !== 0 && <div className="input-label">Tags</div>}
      {tags &&
        tags.map(tag => (
          <div className="tag-wrapper" key={tag.id}>
            <Checkbox
              label={tag.name}
              checked={project.tags.map(tag => tag.name).includes(tag.name)}
              onChange={e => handleTagSelect({ name: tag.name, id: tag.id })}
              name={tag.name}
            />
            <span
              className="delete-tag"
              onClick={() => {
                if (window.confirm('Are you sure?')) handleDeleteTag(tag.id);
              }}
            >
              <X />
            </span>
          </div>
        ))}

      <div className="new-tag-form">
        <Input
          onChange={e => setNewTag(e.target.value)}
          onKeyDown={e => e.keyCode === 13 && e.preventDefault() && handleTagCreation()}
          value={newTag}
          name="newTag"
          placeholder="New Tag Name"
          title="New Tag"
          type="text"
          className="new-tag-form-group"
          small={true}
        />
        <Button type="button" onClick={handleTagCreation}>
          Create Tag
        </Button>
      </div>
    </StyledTags>
  );
};

export default Tags;
