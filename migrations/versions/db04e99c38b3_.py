"""empty message

Revision ID: db04e99c38b3
Revises: 30901d1078c1
Create Date: 2022-05-05 16:27:14.197917

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'db04e99c38b3'
down_revision = '30901d1078c1'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('avatar', sa.String(), nullable=True))
    op.drop_column('user', 'avatar_name')
    op.drop_column('user', 'avatar_mime')
    op.drop_column('user', 'avatar_data')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('avatar_data', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('user', sa.Column('avatar_mime', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('user', sa.Column('avatar_name', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.drop_column('user', 'avatar')
    # ### end Alembic commands ###