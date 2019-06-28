from datetime import datetime

from flask_login import current_user

from flaskapp import db
from flaskapp.models import BaseModel, TableNames


class FileStatus:
    TRANSFERRED = "Transferred"
    DELETED = "Deleted"
    MERGED = "Merged"


class TransferredStatusModel(db.Model, BaseModel):

    # The name of the table at the data base.
    __tablename__ = TableNames.S_TRANSFERRED_STATUS

    # The table columns.
    id = db.Column(db.String(16), primary_key=True)
    description = db.Column(db.String(200), nullable=False)

    def __repr__(self):
        return "TransferredStatusModel(id={}, description={})".format(self.id, self.description)


class FileTransferredModel(db.Model, BaseModel):

    # The name of the table at the data base.
    __tablename__ = TableNames.T_TRANSFERRED_FILES

    # The table columns.
    id = db.Column(db.String(50), primary_key=True)
    status_id = db.Column(db.String(50), db.ForeignKey(TableNames.S_TRANSFERRED_STATUS + ".id"))
    transferred_by = db.Column(db.String(50), unique=False, nullable=False)
    transferred_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return "FileTransferredModel(id={}, status_id={}, transferred_by={}, transferred_at={})"\
            .format(self.id, self.status_id, self.transferred_by, self.transferred_at)

    def save(self):
        if current_user:
            self.transferred_by = current_user.username
        else:
            self.transferred_by = "Unknown"
        super().save()

    def update(self, status_id: str, transferred_at: datetime):
        self.status_id = status_id
        self.transferred_at = transferred_at
        self.save()

