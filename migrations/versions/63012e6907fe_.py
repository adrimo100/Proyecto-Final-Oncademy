"""empty message

Revision ID: 63012e6907fe
Revises: 36fbb7a7fb55
Create Date: 2022-05-04 17:27:22.599389

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '63012e6907fe'
down_revision = '36fbb7a7fb55'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('avatar_name', sa.String(length=50), nullable=True))
    op.add_column('user', sa.Column('avatar_data', sa.LargeBinary(), nullable=True))
    op.drop_column('user', 'avatar')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('avatar', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.drop_column('user', 'avatar_data')
    op.drop_column('user', 'avatar_name')
    # ### end Alembic commands ###
