from datetime import datetime
from typing import List

from flaskapp import db
from flaskapp.models import BaseModel, TableNames


class RoleModel(db.Model, BaseModel):

    # The name of the table at the data base.
    __tablename__ = TableNames.S_ROLES

    # The table columns.
    role_id = db.Column(db.String(50), primary_key=True)
    label = db.Column(db.String(50), unique=True, nullable=False)

    def __repr__(self):
        return "Role(role_id={})".format(self.role_id)

    @classmethod
    def is_valid_role(cls, role_id: str):
        role = cls.find_by_id(role_id)
        if role:
            return True

        return False


class UserRoleModel(db.Model, BaseModel):

    # The name of the table at the data base.
    __tablename__ = TableNames.T_USER_ROLES

    # The table columns.
    user_id = db.Column(db.String(16), db.ForeignKey(TableNames.T_USER + ".id"), primary_key=True)
    role_id = db.Column(db.String(50), db.ForeignKey(TableNames.S_ROLES + ".role_id"), primary_key=True)
    lastchange_by = db.Column(db.String(16), unique=False, nullable=True)
    lastchange_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return "UserRole(id={}, role={})".format(self.user_id, self.role_id)


class RightModel(db.Model, BaseModel):

    # The name of the table at the data base.
    __tablename__ = TableNames.S_RIGHTS

    # The table columns.
    right_id = db.Column(db.String(50), primary_key=True)
    label = db.Column(db.String(100), unique=True, nullable=False)

    def __repr__(self):
        return "Right(right_id={})".format(self.right_id)

    @classmethod
    def is_valid_right(cls, right_id: str):
        right = cls.find_by_id(right_id)
        if right:
            return True

        return False


class UserRightModel(db.Model, BaseModel):

    # The name of the table at the data base.
    __tablename__ = TableNames.T_USER_RIGHTS

    # The table columns.
    user_id = db.Column(db.String(16), db.ForeignKey(TableNames.T_USER + ".id"), primary_key=True)
    right_id = db.Column(db.String(50), db.ForeignKey(TableNames.S_RIGHTS + ".right_id"), primary_key=True)
    lastchange_by = db.Column(db.String(16), unique=False, nullable=True)
    lastchange_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return "UserRight(id={}, right={})".format(self.user_id, self.right_id)


class RolesRightsModel(db.Model, BaseModel):

    # The name of the table at the data base.
    __tablename__ = TableNames.T_ROLES_RIGHTS

    # The table columns.
    role_id = db.Column(db.String(50), db.ForeignKey(TableNames.S_ROLES + ".role_id"), primary_key=True)
    right_id = db.Column(db.String(50), db.ForeignKey(TableNames.S_RIGHTS + ".right_id"), primary_key=True)

    def __repr__(self):
        return "RolesRights(role_id={}, right_id={})".format(self.role_id, self.right_id)

    # Queries for this model.
    @classmethod
    def get_rights_by_role(cls, role_id: str):
        """
        Get the a list of right ids for this role.

        :param role_id: The role id.
        :return: A list of right ids for this role.
        """
        roles_rights: List[RolesRightsModel] = cls.find_by(role_id=role_id, get_first=False)
        if roles_rights:
            return [rr.right_id for rr in roles_rights]

        return None
